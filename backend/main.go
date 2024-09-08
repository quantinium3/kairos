package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/quantinium03/lomes/backend/ffmpego"
)

const (
	musicDir = "/home/quantinium/Music"
	videoDir = "/home/quantinium/Movies"
	animeDir = "/home/quantinium/Anime"
)

func listMusicHandler(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir(musicDir)
	if err != nil {
		http.Error(w, "Failed to list the music files", http.StatusInternalServerError)
		return
	}

	musicFiles := []string{}
	for _, file := range files {
		if !file.IsDir() {
			musicFiles = append(musicFiles, file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(musicFiles)
}

func listVideoHandler(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir(videoDir)
	if err != nil {
		http.Error(w, "failed to list the videos", http.StatusInternalServerError)
		return
	}

	videoFiles := []string{}
	for _, file := range files {
		if !file.IsDir() {
			videoFiles = append(videoFiles, file.Name())
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videoFiles)
}

func musicCoverArtHandler(w http.ResponseWriter, r *http.Request) {
	songName := r.URL.Query().Get("name")
	if songName == "" {
		http.Error(w, "Missing song name", http.StatusBadRequest)
		return
	}

	filePath := filepath.Join(musicDir, songName)
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Song Not Found", http.StatusNotFound)
		return
	}

	pr, err := ffmpego.GetCoverArt(filePath)
	if err != nil {
		http.Error(w, "Failed to extract cover art", http.StatusInternalServerError)
		return
	}

	// Copy the image stream to the response writer
	_, err = io.Copy(w, pr)
	if err != nil {
		http.Error(w, "Failed to send cover art", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "image/jpeg")
}

func listAnimeHandler(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir(animeDir)
	if err != nil {
		http.Error(w, "failed to read the directory", http.StatusInternalServerError)
	}

	animeFiles := []string{}

	for _, file := range files {
		if !file.IsDir() {
			animeFiles = append(animeFiles, file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(animeFiles);
}

func main() {
	http.HandleFunc("/api/music/", listMusicHandler)
	http.HandleFunc("/api/videos/", listVideoHandler)
	http.HandleFunc("/api/music/cover", musicCoverArtHandler)
	http.HandleFunc("/api/anime", listAnimeHandler)

	fmt.Println("Server is listening on port 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
