/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package javaapplication8;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Map;
import java.util.TreeMap;


public class JavaApplication8 {

     static String[] terms=null;
     static  TreeMap<String,Integer> hm=new TreeMap<String,Integer>(); 
     
    public static void main(String[] args) throws IOException {
       
         int line=0;
       
         
   BufferedReader crunchifyBuffer = null;
		
		try {
			String crunchifyLine;
			crunchifyBuffer = new BufferedReader(new FileReader("/Users/praneeththomas/Desktop/JavaApplication8/src/javaapplication8/HuffingtonTS.csv"));
			
			while ((crunchifyLine = crunchifyBuffer.readLine()) != null) {
			//	System.out.println("Raw CSV data: " + crunchifyLine);
			//	System.out.println("Converted ArrayList data: " + crunchifyCSVtoArrayList(crunchifyLine) + "\n");
			 String[] contents=crunchifyLine.split(",");
                         if(++line==1)
                                 terms=contents;
                                 else
                                 
                            process(contents);
                        }
                        Arrays.sort(terms);
                        for(String v:terms){
                            System.out.println(v);
                        }
                          PrintWriter pw = new PrintWriter(new File("TermRelationship.csv"));
                           String head="Term1,Term2,Frequency\n";
                            pw.write(head);
                        for(Map.Entry<String,Integer> entry:hm.entrySet()){
                            
                            String lineCsv=(String)entry.getKey()+","+(Integer)entry.getValue()+"\n";
                            pw.write(lineCsv);
        
                        }
                        pw.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		} 
                finally 
                {
                    if (crunchifyBuffer != null) 
                        crunchifyBuffer.close();
		}
             
                 
             
            /*   
                for(line=0; line<crunchifyResult.size(); line++)
             {
                 String terms = null;
                 String linestr=crunchifyResult[line];
                 if(line==0)
                  String[] terms=line.split(",");
             
                 
                 process(terms);
             }  
                
                */
         /*   String csvFile = "/Users/praneeththomas/Desktop/JavaApplication8/src/relationship.csv";
        FileWriter writer = new FileWriter(csvFile);
                CSVUtils.writeLine(writer, Arrays.asList("", "b", "c", "d")); */
	}


	// Utility which converts CSV to ArrayList using Split Operation
	public static ArrayList<String> crunchifyCSVtoArrayList(String crunchifyCSV) {
		ArrayList<String> crunchifyResult = new ArrayList<String>();
                
		
		if (crunchifyCSV != null) {
			String[] splitData = crunchifyCSV.split("\\n*,\\n*");
			for (int i = 0; i < splitData.length; i++) {
				if (!(splitData[i] == null) || !(splitData[i].length() == 0)) {
					crunchifyResult.add(splitData[i].trim());
				}
			}
		}
		
                return crunchifyResult;
		
             }
             
             
        public static void process(String[] contents)
        {
            
          
            
        
            for(int i=1;i<contents.length;i++)
        
            {
             String temp;
            
             for(int j=1;j<contents.length;j++)
                //for(int j=i+1;j<contents.length;j++)
                {
                 if(i==j)
                     continue;
                 temp = terms[i]+","+terms[j];
                 if(hm.containsKey(temp))
                  {
                     Integer v=hm.get(temp);
                     v=v+Math.min(Integer.parseInt(contents[i]),Integer.parseInt(contents[j]));
                     hm.put(temp, v);
                     }
                 else{
                       int v=Math.min(Integer.parseInt(contents[i]),Integer.parseInt(contents[j]));
                     hm.put(temp, v);
                 }
                 
                 //TESTING
                 /*if(temp.equals("iraq,barack obama")){
                 System.out.println("source"+","+"destination"+"value");
                 System.out.println(temp+","+hm.get(temp));
                 }*/
                 
                 }
           }
        }
        
            
            
            
       
        
}	



