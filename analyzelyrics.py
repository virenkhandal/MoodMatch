from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
import csv

key = "eefd7a51fe184ef382bc1db79d003b69"
endpoint = "https://songsentimentanalyzer.cognitiveservices.azure.com/"


def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, credential=ta_credential)
    return text_analytics_client

cleaned = "Mining&Gathering/SongRecommender/cleaned.csv"
analyzed = "Mining&Gathering/SongRecommender/analyzed.csv"


client = authenticate_client()


def analyze(client):
    openCSVtoRead = open(cleaned, 'r')
    reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(analyzed, 'w')
    writer = csv.writer(openCSVtoWrite)
    for row in reader:
        response = client.analyze_sentiment(documents=[row[2]])[0]
        positive = response.confidence_scores.positive
        negative = response.confidence_scores.negative
        neutral = response.confidence_scores.neutral
        writer.writerow([row[0], row[1], row[2], response.sentiment, positive, negative, neutral])


def runAnalysis():
    analyze(client)
