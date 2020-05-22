# -*- coding: utf-8 -*-
import scrapy


class GeniusCrawlerSpider(scrapy.Spider):
    name = 'GeniusCrawler'
    allowed_domains = ['https://genius.com/#top-songs']
    start_urls = ['https://genius.com/#top-songs']

    def parse(self, response):
        # Get categories for songs (gives basis for emotional analysis)
        categories = 0

        # Get titles for songs
        titles = response.css('.fODYHn::text').extract()
        artists = response.css('.kiggdb::text').extract()

        for i in range(len(titles)):
            yield{
                'Title': titles[i],
                'Artist': artists[i]
            }
