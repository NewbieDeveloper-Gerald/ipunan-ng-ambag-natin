import { Image, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { photoURI } from '../services/photos';
export const colors={ink:'#173d33',green:'#17785e',muted:'#677a70',paper:'#f5f6f0',line:'#e0e7dd'};
export function Button({title,onPress,secondary=false,disabled=false}:{title:string;onPress:()=>void;secondary?:boolean;disabled?:boolean}) {
 return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[u.button,secondary&&u.secondary,disabled&&{opacity:0.4}]}><Text style={{color:secondary?colors.green:'white',fontWeight:'700',fontSize:15}}>{title}</Text></Pressable>;
}
export function Field({label,...props}:TextInputProps & {label:string}) {return <View style={{gap:7}}><Text style={u.label}>{label}</Text><TextInput placeholderTextColor="#87988d" {...props} style={[u.input,props.style]} /></View>;}
export function Avatar({name,path}:{name:string;path:string|null}) {
 const uri=photoURI(path);
 return uri?<Image accessibilityLabel={`${name}'s photo`} source={{uri}} style={u.avatar}/>:<View style={[u.avatar,{backgroundColor:'#e5efdf',alignItems:'center',justifyContent:'center'}]}><Text style={{color:colors.green,fontWeight:'800',fontSize:19}}>{name.trim().split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase()}</Text></View>;
}
export const u=StyleSheet.create({
 card:{backgroundColor:'white',borderRadius:20,padding:20,gap:14,borderColor:colors.line,borderWidth:1},
 title:{fontSize:30,fontWeight:'800',color:colors.ink,letterSpacing:-0.7},heading:{fontSize:19,fontWeight:'700',color:colors.ink},
 body:{fontSize:14,lineHeight:22,color:colors.muted},label:{fontSize:12,fontWeight:'700',color:colors.muted},
 button:{padding:15,borderRadius:13,alignItems:'center',backgroundColor:colors.green,minHeight:48},secondary:{backgroundColor:'#e9f0e3'},
 input:{borderWidth:1,borderColor:'#d5ded1',borderRadius:12,padding:13,fontSize:16,backgroundColor:'#fbfcf8',color:colors.ink,minHeight:48},
 row:{flexDirection:'row',alignItems:'center',gap:12},avatar:{width:48,height:48,borderRadius:16},
 pill:{paddingHorizontal:14,paddingVertical:11,borderRadius:24,backgroundColor:'#e9eee3'},pillText:{color:colors.green,fontWeight:'700',fontSize:12},
 divider:{height:1,backgroundColor:colors.line},
});
