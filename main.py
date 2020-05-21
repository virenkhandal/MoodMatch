import csv
import lyricsgenius

genius = lyricsgenius.Genius("m17kwEB8esoXIGoiSWAxM-HxuVSPTnZ9YAXct_HBNh_O4y6BoNRQa5TrIkMH_l6C")


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
        lyrics = genius.search_song(song, artist)
        # writer.writerow({'Title': song,'Artist': artist,'Lyrics': words})
        writer.writerow([row[0], row[1], lyrics])
    openCSVtoWrite.close()
    openCSVtoRead.close()


if __name__ == "__main__":
    writeLyrics("SongRecommender/Spotify/spotify.csv", "SongRecommender/Spotify/updatedspotify.csv")
    writeLyrics("SongRecommender/Billboard/billboard.csv", "SongRecommender/Billboard/updatedbillboard.csv")
    writeLyrics("SongRecommender/PopVortex/popvortex.csv", "SongRecommender/PopVortex/updatedpopvortex.csv")
    writeLyrics("SongRecommender/Genius/genius.csv", "SongRecommender/Genius/updatedgenius.csv")
