package cn.zxw.echarts.practice;

import java.util.ArrayList;
import java.util.List;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
    	/*int i=0;
    	while(i<=60){
    		System.out.print( "'"+i+"'," );
    		i++;
    	}*/
    	
    	/*int i=0;
    	while(i<=12){
    		for(int j=0;j<60;j++){
    			if(j==0||j==5){
    				System.out.print( "'"+i+":0"+j+"'," );
    			}else if(j%5==0){
    				System.out.print( "'"+i+":"+j+"'," );
    			}else{
    				System.out.print( "''," );
    			}
    			
    		}
    		i++;
    	}*/
    	
    	/*int i=0;
    	while(i<=12){
    		for(int j=0;j<60;j++){
    			if(j<10){
    				System.out.print( "'"+i+":0"+j+"'," );
    			}else{
    				System.out.print( "'"+i+":"+j+"'," );
    			}
    		}
    		i++;
    	}*/
    	
    	/*int i=0;
    	while(i<24){
    		for(int j=0;j<60;j++){
    			String str=(i<10?"0":"")+i+(j<10?"0":"")+j;
    			System.out.println(str);
    		}
    		i++;
    	}*/
    	
    	System.out.println("20150401184334".substring(8, 12));
    	int n=Integer.parseInt("5");
    	System.out.println(Float.parseFloat("3434"));
    	/*List<String> list=new ArrayList<String>();
        list.set(5, "element");
        System.out.println(list.size());
        for(String s:list){
        	System.out.print(s+" , ");
        }*/
    }
}
