import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { useCallback, useEffect, useState } from "react";
import {debounce} from "lodash";

export default function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    console.log('songInfo', songInfo);

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume);
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 500), []
    )

    return (
        <div className="items-center justify-evenly h-40 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-ba px-2 md:px-8">
            <div className="flex items-center justify-start space-x-4">
                <img
                    className="h-20 w-20"
                    src={songInfo?.album.images?.[0]?.url}
                    alt=""
                />
                <div className="hidden md:inline">
                    <h3>{songInfo?.name}</h3>
                    <div className="flex scroll-auto snap-x max-w-2/5 space-x-2">
                        {songInfo?.artists?.map((art, i) => (
                            <p key={i} className="snap-start" >{art.name}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-20 h-20" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-20 h-20" />
                )}
                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume - 10)}/>
                <input
                    className="w-14 md:w-28"
                    type="range"
                    onChange={(e) => setVolume(Number(e.target.value))}
                    value={volume}
                    min={0} max={100}/>
                <VolumeUpIcon className="button" onClick={() => volume < 100 && setVolume(volume + 10)}/>
            </div>
        </div>
    )
}
