package ffmpego

import (
	"bytes"
	"image"
	"os/exec"
)

func GetCoverArt(args ...string) (image.Image, error)  {
	cmd := exec.Command("ffmpeg", args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()

	if err != nil {
		return nil, err
	}

	img, _, err := image.Decode(&out)
	if err != nil {
		return nil, err
	}

	return img, nil
}

