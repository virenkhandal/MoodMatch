# -*- coding: utf-8 -*-
import scrapy


class PopVortexCrawlerSpider(scrapy.Spider):
    name = 'PopVortexCrawler'
    allowed_domains = ['http://www.popvortex.com/music/charts/top-100-songs.php']
    start_urls = ['http://www.popvortex.com/music/charts/top-100-songs.php']

    def parse(self, response):
        titles = response.css('.title a::text').extract()
        artists = response.css('.artist::text').extract()

        for i in range(len(titles)):
            yield {
                'Title': titles[i],
                'Artist': artists[i]
            }
