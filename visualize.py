import matplotlib.pyplot as plt
import csv

analyzed = "Mining/SongRecommender/analyzed.csv"

def visualize():
    openCSVtoRead = open(analyzed, 'r')
    reader = csv.reader(openCSVtoRead)
    xcoords = []
    ycoords = []
    colors = []
    for row in reader:
        x = row[4]
        y = row[5]
        xcoords.append(x)
        ycoords.append(y)
        color = 'red'
        if row[3] == "positive":
            color = 'green'
        elif row[3] == "negative":
            color = 'blue'
        colors.append(color)
    plt.scatter(xcoords, ycoords, color=colors)
    plt.show()
