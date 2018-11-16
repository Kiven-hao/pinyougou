package com.pinyougou.shop.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import entity.Result;
import util.FastDFSClient;

@RestController
public class UploadController {
	@Value("${FILE_SERVER_URL}")
	private String FILE_SERVER_URL;
	public Result upload(MultipartFile file) {
		//获取文件的扩展名
		String originalFilename = file.getOriginalFilename();
		String extName=originalFilename.substring(originalFilename.lastIndexOf(".")+1);
		try {
			
			FastDFSClient fastDFSClient = new FastDFSClient("classpath:config/fdfs_client.conf");
			String path=fastDFSClient.uploadFile(file.getBytes(),extName);
			String url = FILE_SERVER_URL + path;
			return new Result(true,url);
		}catch (Exception e) {
			// TODO: handle exception
			return new Result(false, "上传失败");
		}
	}
}
