package com.pinyougou.page.service;

/**
 * 生成商品详情页的接口
 * @author Kiven
 *
 */
public interface ItemPageService {
	
	
	/**
	 * 根据商品id生成静态化页面
	 * @param goodsId
	 * @return
	 */
	public boolean genItemHtml(Long goodsId);
}
