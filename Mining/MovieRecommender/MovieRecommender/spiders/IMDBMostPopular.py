# -*- coding: utf-8 -*-
import scrapy


class ImdbmostpopularSpider(scrapy.Spider):
    name = 'IMDBMostPopular'
    allowed_domains = ['https://www.imdb.com/chart/moviemeter/']
    start_urls = ['https://www.imdb.com/chart/moviemeter/']

    def parse(self, response):
        # Get categories for songs (gives basis for emotional analysis)
        categories = 0

        # Get titles for songs
        titles = response.css('a::text').extract()
        #        years = response.css('.secondaryInfo::text').extract()
        for i in range(len(titles)):
            yield {
                'Title': titles[i],
                # 'Years': years[i]
            }
