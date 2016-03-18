package cn.zxw.pos.test;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

public class Test {
	static String path="C:\\Users\\zhangxw\\Desktop\\realtime\\2015-07-29\\";
	
	public static void main(String[] args) throws IOException {
		/*filterCsv("860100010050300028_2015-07-29 12_10_2.csv");
		filterCsv("860100010050300028_2015-07-29 12_20_2.csv");
		filterCsv("860100010050300028_2015-07-29 12_30_2.csv");
		filterCsv("860100010050300028_2015-07-29 12_40_2.csv");
		filterCsv("860100010050300028_2015-07-29 12_50_2.csv");*/
		getPeople("860100010050300028.csv");
	}
	
	public static void filterCsv(String name) throws IOException {
		File file=new File(path+name);
		List<String> lines=FileUtils.readLines(file);
		List<String> res=new ArrayList<String>();
		for(String line:lines){
			String[] arr=line.split("\t");
			if(arr.length > 6 && "20010".equals(arr[3])){
				res.add(arr[0]+"\t"+arr[1]+"\t"+arr[4]+"\t"+arr[5]);
			}
		}
		File destFile=new File(path+"860100010050300028.csv");
		FileUtils.writeLines(destFile, "UTF-8", res, "\r\n", true);
	}
	
	public static void getPeople(String name) throws IOException {
		File file=new File(path+name);
		List<String> lines=FileUtils.readLines(file);
		List<String> res=new ArrayList<String>();
		for(String line:lines){
			String[] arr=line.split("\t");
			if(arr.length > 6 && "20010".equals(arr[3])){
				res.add(arr[0]+"\t"+arr[1]+"\t"+arr[4]+"\t"+arr[5]);
			}
		}
		File destFile=new File(path+"860100010050300028.csv");
		FileUtils.writeLines(destFile, "UTF-8", res, "\r\n", true);
	}
	
}
