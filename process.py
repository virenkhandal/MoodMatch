from math import hypot
import csv


def norm(x, y):
    return hypot(x, y)


def process(csvFiletoRead, csvFiletoWrite):
    openCSVtoRead = open(csvFiletoRead, 'r')
    reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(csvFiletoWrite, 'w')
    writer = csv.writer(openCSVtoWrite)
    for row in reader:
        pos = row[4]
        neg = row[5]
        dist = norm(pos, neg)
        if (dist):
            writer.writerow()


