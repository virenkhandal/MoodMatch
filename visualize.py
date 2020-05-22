import matplotlib.pyplot as plt
import csv

analyzed = "Mining&Gathering/SongRecommender/analyzed.csv"

def visualize():
    openCSVtoRead = open(analyzed, 'r')
    reader = csv.reader(openCSVtoRead)
    xcoords = []
    ycoords = []
    colors = []
    for row in reader:
        x = row[4]
        xcoords.append(x)
        y = row[5]
        ycoords.append(y)
        if row[3] == "positive":
            color = 'red'
        elif row[3] == "negative":
            color = 'blue'
        elif row[3] == "mixed":
            color = 'green'
        colors.append(color)
    plt.scatter(xcoords, ycoords, color=colors)
    plt.show()
