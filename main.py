import csv
import lyricsgenius
from cleandata import run, removeBlanks
from analyzelyrics import runAnalysis

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
analyzed = "Mining&Gathering/SongRecommender/analyzed.csv"

genius = lyricsgenius.Genius("m17kwEB8esoXIGoiSWAxM-HxuVSPTnZ9YAXct_HBNh_O4y6BoNRQa5TrIkMH_l6C")

importnewdata = False
cleandata = False
blanks = False
analyzeLyrics = False


def writeLyrics(csvFiletoRead, csvFiletoWrite):
    openCSVtoRead = open(csvFiletoRead, 'r')
    reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(csvFiletoWrite, 'w')
    writer = csv.writer(openCSVtoWrite)
    for row in reader:
        artist = row[1]
        # if "The" in artist:
        #    artist = artist.replace("The ", "", 3)
        # trueartist = genius.search_artist(artist)
        song = row[0]
        # words = lyrics(artist, song)
        song = genius.search_song(song, artist)
        # writer.writerow({'Title': song,'Artist': artist,'Lyrics': words})
        if song is not None:
            writer.writerow([row[0], row[1], song.lyrics])
    openCSVtoWrite.close()
    openCSVtoRead.close()


if __name__ == "__main__":
    if importnewdata:
        print("Importing new data...")
        writeLyrics("Mining&Gathering/SongRecommender/Spotify/spotify.csv",
                    "Mining&Gathering/SongRecommender/Spotify/updatedspotify.csv")
        writeLyrics("Mining&Gathering/SongRecommender/Billboard/billboard.csv",
                    "Mining&Gathering/SongRecommender/Billboard/updatedbillboard.csv")
        writeLyrics("Mining&Gathering/SongRecommender/PopVortex/popvortex.csv",
                    "Mining&Gathering/SongRecommender/PopVortex/updatedpopvortex.csv")
        writeLyrics("Mining&Gathering/SongRecommender/Genius/genius.csv",
                    "Mining&Gathering/SongRecommender/Genius/updatedgenius.csv")
    if cleandata:
        print("Cleaning data...")
        run()
    if blanks:
        print("Removing blanks from data...")
        removeBlanks(final, cleaned)
    if analyzeLyrics:
        runAnalysis()
