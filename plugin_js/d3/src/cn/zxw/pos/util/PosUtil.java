package cn.zxw.pos.util;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

public class PosUtil {
	
	static String path="C:\\Users\\zhangxw\\Desktop\\realtime\\2015-07-29\\860100010050300028.csv";
	static List<String> lines = null;
	static int min=0;
	static int sec=2;//10,20,...60
	static int size=0;
	static int index=0;
	
	static{
		try {
			File file=new File(path);
			lines=FileUtils.readLines(file);
			size = lines.size();
			if(size>0){
				min = Integer.parseInt(lines.get(0).split(":")[1]);
				//sec = Integer.parseInt(lines.get(0).split(":")[2]);
			}
			System.out.println("》》》初始化数据完成！《《《");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static Collection<String> getUsers(){
		System.out.println("indx="+index+",min="+min+",sec="+sec);
		Map<String,String> res=new HashMap<String, String>();
		while(index < size){
			String line = lines.get(index);
			String[] arr=line.split("\t");
			int line_m=Integer.parseInt(arr[0].split(":")[1]);
			int line_s=Integer.parseInt(arr[0].split(":")[2]);
			if(min == line_m && line_s < sec){
				res.put(arr[1], line);
				index++;
			}else{
				if(min != line_m){
					min = line_m;
				}
				sec = sec==60?2:sec+2;
				break;
			}
		}
		return res.values();
	}
}
