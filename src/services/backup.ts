import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Documents from 'expo-document-picker';
import { randomUUID } from 'expo-crypto';
import { fromByteArray, toByteArray } from 'base64-js';
import { snapshot, replaceData, saveSetting } from '../repositories/core';
import { validateBackup, type Backup } from '../utils/validation';
import { photoDirectory } from './photos';
const MAX_BYTES=30*1024*1024;
async function makeBackup() {
 const data=await snapshot(); const photos:Record<string,string>={}; let size=0;
 for(const m of data.members) if(m.photo_path && !photos[m.photo_path]) {
  const file=new File(Paths.document,m.photo_path);
  if(!file.exists) throw new Error(`Photo for ${m.name} is missing. Backup stopped to avoid an incomplete file.`);
  size+=file.size;
  if(size>20*1024*1024) throw new Error('Photo data exceeds the 20 MB core-backup limit.');
  photos[m.photo_path]=fromByteArray(await file.bytes());
 }
 const payload=validateBackup({...data,photos});
 const text=JSON.stringify(payload);
 if(text.length>MAX_BYTES) throw new Error('Backup exceeds the 30 MB core-backup limit.');
 return text;
}
export async function exportBackup() {
 if(!await Sharing.isAvailableAsync()) throw new Error('File sharing is unavailable on this device.');
 const file=new File(Paths.cache,`ambag-natin-${Date.now()}.json`);
 await file.write(await makeBackup());
 await Sharing.shareAsync(file.uri,{mimeType:'application/json',UTI:'public.json',dialogTitle:'Save your Ambag Natin backup'});
 // This is an export attempt, not proof that a user saved from the share sheet.
 await saveSetting('last_export_attempt',new Date().toISOString());
}
export async function pickBackup():Promise<Backup|null> {
 const result=await Documents.getDocumentAsync({type:['application/json','text/plain','application/octet-stream'],copyToCacheDirectory:true});
 if(result.canceled) return null;
 const file=new File(result.assets[0].uri);
 if(file.size>MAX_BYTES) throw new Error('Backup must be no larger than 30 MB.');
 return validateBackup(JSON.parse(await file.text()));
}
export async function restoreBackup(data:Backup) {
 validateBackup(data);
 // Durable safety copy MUST succeed before replacing any records.
 const dir=new Directory(Paths.document,'safety-backups');dir.create({idempotent:true});
 const safety=new File(dir,`before-restore-${Date.now()}.json`);
 await safety.write(await makeBackup());
 photoDirectory();
 const photos:Record<string,string>={};
 // New filenames prevent photo collisions with existing records if restore fails.
 for(const [old,base64] of Object.entries(data.photos)) {
  const path=`photos/${randomUUID()}.jpg`;
  await new File(Paths.document,path).write(toByteArray(base64)); photos[old]=path;
 }
 await replaceData({...data,members:data.members.map(m=>({...m,photo_path:m.photo_path?photos[m.photo_path]:null}))});
 return safety.name;
}
export async function shareLatestSafety() {
 const dir=new Directory(Paths.document,'safety-backups');
 if(!dir.exists) throw new Error('No restore safety copy exists yet.');
 const files=dir.list().filter((f):f is File=>f instanceof File).sort((a,b)=>b.name.localeCompare(a.name));
 if(!files.length) throw new Error('No restore safety copy exists yet.');
 await Sharing.shareAsync(files[0].uri,{mimeType:'application/json',UTI:'public.json'});
}

// Android folder picker permits a genuinely offline backup without a share target.
export async function saveBackupToFolder() {
 const directory = await Directory.pickDirectoryAsync();
 const text = await makeBackup();
 const file = directory.createFile(`ambag-natin-${Date.now()}.json`, 'application/json');
 await file.write(text);
 validateBackup(JSON.parse(await file.text()));
 const now = new Date().toISOString();
 await saveSetting('last_backup_saved', now);
 await saveSetting('last_export_attempt', now);
}
