package com.pinyougou.sellergoods.service;

import java.util.List;

import com.pinyougou.pojo.TbBrand;

import entity.PageResult;

public interface BrandService {
	public List<TbBrand>findAll();
	
	public PageResult findPage(int pageNum,int pageSize);
	
	public void add(TbBrand tbBrand);
	
	public TbBrand findOne(Long id);
	
	public void update(TbBrand tbBrand);
	
	public void delete(Long[] ids);
	
	public PageResult findPage(TbBrand tbBrand,int pageNum,int pageSize);
}
