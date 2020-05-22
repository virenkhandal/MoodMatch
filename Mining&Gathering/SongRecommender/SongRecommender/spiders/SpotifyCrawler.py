# -*- coding: utf-8 -*-
import scrapy


class SpotifyCrawlerSpider(scrapy.Spider):
    name = 'SpotifyCrawler'
    allowed_domains = ['https://open.spotify.com/playlist']
    start_urls = ['https://open.spotify.com/playlist/37i9dQZEVXbLRQDuF5jeBp',
                  'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
                  'https://open.spotify.com/playlist/37i9dQZF1DX8C9xQcOrE6T',
                  'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
                  'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
                  'https://open.spotify.com/playlist/37i9dQZF1DWYBO1MoTDhZI',
                  'https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gmx']

    def parse(self, response):
        # Get categories for songs (gives basis for emotional analysis)
        categories = 0

        # Get titles for songs
        titles = response.css('.track-name::text').extract()
        artists = response.xpath('//a[contains(@href, "artist")]/span/text()').extract()

        for i in range(len(titles)):
            yield {
                'Title': titles[i],
                'Artist': artists[i]
            }
