from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
import csv

key = "e2bb4d8d17a54c0599bedf0a85b8eb75"
endpoint = "https://moodmatch.cognitiveservices.azure.com/"


def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, credential=ta_credential)
    return text_analytics_client

cleaned = "Mining/MovieRecommender/TMDBOverview.csv"
analyzed = "Mining/MovieRecommender/analyzed.csv"


client = authenticate_client()


def analyze(client):
    openCSVtoRead = open(cleaned, 'r')
    reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(analyzed, 'w')
    writer = csv.writer(openCSVtoWrite)
    for row in reader:
        response = client.analyze_sentiment(documents=[row[1]])[0]
        positive = response.confidence_scores.positive
        negative = response.confidence_scores.negative
        neutral = response.confidence_scores.neutral
        writer.writerow([row[0], row[1], response.sentiment, positive, negative, neutral])


def runOverview():
    analyze(client)
