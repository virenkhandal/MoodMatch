# -*- coding: utf-8 -*-
import scrapy


class BillboardCrawlerSpider(scrapy.Spider):
    name = 'BillboardCrawler'
    allowed_domains = ['https://www.billboard.com/charts/hot-100']
    start_urls = ['https://www.billboard.com/charts/hot-100']

    def parse(self, response):
        # Get categories for songs (gives basis for emotional analysis)
        categories = 0

        # Get titles for songs
        titles = response.css('span.chart-element__information__song::text').extract()
        artists = response.css('span.chart-element__information__artist::text').extract()

        for i in range(len(titles)):
            yield {
                'Title': titles[i],
                'Artist': artists[i]
            }
