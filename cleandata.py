import pandas as pd

# Spotify files
spotify = "SongRecommender/Spotify/updatedspotify.csv"
spotifyClean = "SongRecommender/Spotify/spotifyClean.csv"

# Genius files
genius = "SongRecommender/Genius/updatedgenius.csv"
geniusClean = "SongRecommender/Genius/geniusClean.csv"

# Pop Vortex files
popvortex = "SongRecommender/PopVortex/updatedpopvortex.csv"
popvortexClean = "SongRecommender/PopVortex/popvortexClean.csv"

# Billboard files
billboard = "SongRecommender/Billboard/updatedbillboard.csv"
billboardClean = "SongRecommender/Billboard/billboardClean.csv"

# Merge data file
merge = "SongRecommender/merged.csv"

# Final cleaned data file
final = "SongRecommender/final.csv"


def clean(csvFiletoRead, csvFiletoWrite):
    df = pd.read_csv(csvFiletoRead)
    df.drop_duplicates(inplace=True)
    df.to_csv(csvFiletoWrite, index=False)


def merger(fileOne, fileTwo, fileThree, fileFour, toFile):
    result = pd.concat([pd.read_csv(fileOne), pd.read_csv(fileTwo),
                        pd.read_csv(fileThree), pd.read_csv(fileFour)], ignore_index=False)
    result.to_csv(toFile, index=False)


def run():
    clean(spotify, spotifyClean)
    clean(genius, geniusClean)
    clean(popvortex, popvortexClean)
    clean(billboard, billboardClean)
    merger(spotifyClean, geniusClean, popvortexClean, billboardClean, merge)
    clean(merge, final)
