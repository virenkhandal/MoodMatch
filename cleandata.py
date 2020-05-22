import pandas as pd
import csv

# Spotify files
spotify = "Mining&Gathering/SongRecommender/Spotify/updatedspotify.csv"
spotifyClean = "Mining&Gathering/SongRecommender/Spotify/spotifyClean.csv"

# Genius files
genius = "Mining&Gathering/SongRecommender/Genius/updatedgenius.csv"
geniusClean = "Mining&Gathering/SongRecommender/Genius/geniusClean.csv"

# Pop Vortex files
popvortex = "Mining&Gathering/SongRecommender/PopVortex/updatedpopvortex.csv"
popvortexClean = "Mining&Gathering/SongRecommender/PopVortex/popvortexClean.csv"

# Billboard files
billboard = "Mining&Gathering/SongRecommender/Billboard/updatedbillboard.csv"
billboardClean = "Mining&Gathering/SongRecommender/Billboard/billboardClean.csv"

# Merge data file
merge = "Mining&Gathering/SongRecommender/merged.csv"

# Final cleaned data file
final = "Mining&Gathering/SongRecommender/final.csv"
cleaned = "Mining&Gathering/SongRecommender/cleaned.csv"


def clean(csvFiletoRead, csvFiletoWrite):
    df = pd.read_csv(csvFiletoRead)
    df.drop_duplicates(inplace=True)
    df.to_csv(csvFiletoWrite, index=False)


def merger(fileOne, fileTwo, fileThree, fileFour, toFile):
    result = pd.concat([pd.read_csv(fileOne), pd.read_csv(fileTwo),
                        pd.read_csv(fileThree), pd.read_csv(fileFour)], ignore_index=False)
    result.to_csv(toFile, index=False)


def removeBlanks(filetoRead, filetoWrite):
    openCSVtoRead = open(filetoRead, 'r')
    reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(filetoWrite, 'w')
    writer = csv.writer(openCSVtoWrite)
    for row in reader:
        if row[2] == "":
            print("Blank")
            continue
        else:
            writer.writerow(row)


def run():
    clean(spotify, spotifyClean)
    clean(genius, geniusClean)
    clean(popvortex, popvortexClean)
    clean(billboard, billboardClean)
    merger(spotifyClean, geniusClean, popvortexClean, billboardClean, merge)
    clean(merge, final)
