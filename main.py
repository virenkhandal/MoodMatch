import csv
import lyricsgenius
from cleandata import run, removeBlanks

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
cleaned = "SongRecommender/cleaned.csv"

genius = lyricsgenius.Genius("m17kwEB8esoXIGoiSWAxM-HxuVSPTnZ9YAXct_HBNh_O4y6BoNRQa5TrIkMH_l6C")

importnewdata = False
cleandata = False
blanks = False


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
        writeLyrics("SongRecommender/Spotify/spotify.csv", "SongRecommender/Spotify/updatedspotify.csv")
        writeLyrics("SongRecommender/Billboard/billboard.csv", "SongRecommender/Billboard/updatedbillboard.csv")
        writeLyrics("SongRecommender/PopVortex/popvortex.csv", "SongRecommender/PopVortex/updatedpopvortex.csv")
        writeLyrics("SongRecommender/Genius/genius.csv", "SongRecommender/Genius/updatedgenius.csv")
    if cleandata:
        print("Cleaning data...")
        run()
    if blanks:
        print("Removing blanks from data...")
        removeBlanks(final, cleaned)
