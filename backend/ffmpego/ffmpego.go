package ffmpego

import (
	"io"
	"os/exec"
)

func GetCoverArt(filePath string) (io.Reader, error) {
	pr, pw := io.Pipe()
	cmd := exec.Command("ffmpeg", "-i", filePath, "-an", "-map 0:v:0", "-c:v copy", "-f", "image2", "pipe:1")
	cmd.Stdout = pw

	err := cmd.Start()
	if err != nil {
		return nil, err
	}

	go func() {
		defer pw.Close()
		cmd.Wait()
	}()

	return pr, nil
}
