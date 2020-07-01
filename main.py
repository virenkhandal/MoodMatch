import csv
import lyricsgenius
from cleandata import run, removeBlanks
from analyzelyrics import runAnalysis
from analyzeoverview import runOverview
from visualize import visualize
from tmdbv3api import TMDb
from tmdbv3api import Movie


# Spotify files
spotify = "Mining/SongRecommender/Spotify/updatedspotify.csv"
spotifyClean = "Mining/SongRecommender/Spotify/spotifyClean.csv"

# Genius files
genius = "Mining/SongRecommender/Genius/updatedgenius.csv"
geniusClean = "Mining/SongRecommender/Genius/geniusClean.csv"

# Pop Vortex files
popvortex = "Mining/SongRecommender/PopVortex/updatedpopvortex.csv"
popvortexClean = "Mining/SongRecommender/PopVortex/popvortexClean.csv"

# Billboard files
billboard = "Mining/SongRecommender/Billboard/updatedbillboard.csv"
billboardClean = "Mining/SongRecommender/Billboard/billboardClean.csv"

# Merge data file
merge = "Mining/SongRecommender/merged.csv"

# Final cleaned data file
final = "Mining/SongRecommender/final.csv"
cleaned = "Mining/SongRecommender/cleaned.csv"
analyzed = "Mining/SongRecommender/analyzed.csv"

genius = lyricsgenius.Genius("m17kwEB8esoXIGoiSWAxM-HxuVSPTnZ9YAXct_HBNh_O4y6BoNRQa5TrIkMH_l6C")

importnewdata = False
cleandata = False
blanks = False
analyzeLyrics = False
plotting = False
findingGenre = False
analyzeOverview = True

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

tmdb = TMDb()
tmdb.api_key = '6059876de4b1032e753411e483b2f7d9'
movie = Movie()
popular = movie.popular()

def findGenre(csvFiletoWrite):
    # openCSVtoRead = open(csvFiletoRead, 'r')
    # reader = csv.reader(openCSVtoRead)
    openCSVtoWrite = open(csvFiletoWrite, 'w')
    writer = csv.writer(openCSVtoWrite)
    for p in popular:
        writer.writerow([p.title, p.overview])


if __name__ == "__main__":
    if importnewdata:
        print("Importing new data...")
        writeLyrics("Mining/SongRecommender/Spotify/spotify.csv",
                    "Mining/SongRecommender/Spotify/updatedspotify.csv")
        writeLyrics("Mining/SongRecommender/Billboard/billboard.csv",
                    "Mining/SongRecommender/Billboard/updatedbillboard.csv")
        writeLyrics("Mining/SongRecommender/PopVortex/popvortex.csv",
                    "Mining/SongRecommender/PopVortex/updatedpopvortex.csv")
        writeLyrics("Mining/SongRecommender/Genius/genius.csv",
                    "Mining/SongRecommender/Genius/updatedgenius.csv")
    if cleandata:
        print("Cleaning data...")
        run()
    if blanks:
        print("Removing blanks from data...")
        removeBlanks(final, cleaned)
    if analyzeLyrics:
        runAnalysis()
    if plotting:
        visualize()
    if findingGenre:
        findGenre("Mining/MovieRecommender/TMDBOverview.csv")
    if analyzeOverview:
        runOverview()