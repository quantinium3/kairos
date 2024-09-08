package ffmpego

import (
    "bytes"
    "os/exec"
)

// GetCoverArt extracts cover art from a media file and returns it as a byte slice.
func GetCoverArt(args ...string) ([]byte, error) {
    cmd := exec.Command("ffmpeg", args...)
    var out bytes.Buffer
    cmd.Stdout = &out
    err := cmd.Run()
    if err != nil {
        return nil, err
    }
    return out.Bytes(), nil
}
