package cn.zxw.echarts.practice;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;

public class MapData {

	public static void main(String[] args) {
		try {
			List<String> lines=FileUtils.readLines(new File("C:\\Users\\zhangxw\\Desktop\\build.txt"));
			StringBuffer sb=new StringBuffer();
			sb.append("[");
			for(String line: lines){
				String[] arr=line.split("\t");
				if(Double.parseDouble(arr[1]) > 0){
					sb.append("{name:'").append(arr[0]).append("',value:90,geoCoord:[").append(arr[1]).append(",").append(arr[2]).append("]},\r\n");
				}else{
					System.out.println(line);
				}
			}
			sb.append("]");
			//System.out.println(sb.toString());
			FileUtils.writeStringToFile(new File("C:\\Users\\zhangxw\\Desktop\\builddata.txt"), sb.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
