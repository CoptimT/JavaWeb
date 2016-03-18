package cn.zxw.pos.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.zxw.pos.util.PosUtil;

/**
 * Servlet implementation class PosServlet
 */
@WebServlet("/pos")
public class PosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PosServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		//parameter
		String _danw=request.getParameter("danw");
		String _scale=request.getParameter("scale");
		if(_danw==null || _scale == null){
			System.out.println("=====参数不全！=====");
			return;
		}
		int danw=Integer.parseInt(_danw);
		double scale=Double.parseDouble(_scale);
		//var
		StringBuffer sb=new StringBuffer();
		String time=null;
		String mac=null;
		int coordx=0;
		int coordy=0;
		int i=1;
		//for
		Collection<String> res=PosUtil.getUsers();
		for(String line:res){
			String arr[]=line.split("\t");
			time = arr[0];
			mac = arr[1];
			coordx=Integer.parseInt(arr[2]);
			coordy=Integer.parseInt(arr[3]);
			double left=(coordx/ danw)/(scale*100);
			double top=(coordy/ danw)/(scale*100);
			String tip="'顾客："+mac+"\n坐标:("+coordx+","+coordy+")\n时间："+time+"'";
			sb.append("<div id='img_dw"+i+"' x_coord="+coordx+" y_coord="+coordy+" style='position:absolute; width:12px; height:12px; left:"+left+"px; top:"+top+"px; z-index:5; overflow:visible;'><img src='/d3/images/marker_2.png' alt="+tip+" title="+tip+" /></div>");
			i++;
		}
		PrintWriter out=response.getWriter();
		out.print(sb.toString());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
