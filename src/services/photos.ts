import { File, Directory, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { randomUUID } from 'expo-crypto';
import * as Picker from 'expo-image-picker';
export function photoURI(path:string|null) { return path ? new File(Paths.document,path).uri : undefined; }
export function photoDirectory() { const dir=new Directory(Paths.document,'photos'); dir.create({idempotent:true,intermediates:true}); return dir; }
export async function choosePhoto(camera=false) {
 if(camera && !(await Picker.requestCameraPermissionsAsync()).granted) throw new Error('Camera permission denied. You can choose a gallery photo instead.');
 const options:Picker.ImagePickerOptions={mediaTypes:['images'],allowsEditing:true,aspect:[1,1],quality:0.8};
 const result=await (camera?Picker.launchCameraAsync(options):Picker.launchImageLibraryAsync(options));
 if(result.canceled) return null;
 const asset=result.assets[0];
 const context=ImageManipulator.manipulate(asset.uri);
 context.resize(asset.width>=asset.height?{width:512}:{height:512});
 const image=await context.renderAsync();
 const output=await image.saveAsync({format:SaveFormat.JPEG,compress:0.75});
 photoDirectory();
 const path=`photos/${randomUUID()}.jpg`;
 await new File(output.uri).copy(new File(Paths.document,path));
 return path;
}
