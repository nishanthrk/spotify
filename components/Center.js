import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]

function Center() {

    // { data: session } = useSession(); means what ever the value coming from the fucntion as data will be assigned to session
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [ color, setColor ] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId)
            .then(function (data) {
                setPlaylist(data.body)
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }, [spotifyApi, playlistId])

    // console.log('Here is the playlist >>>', playlist);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div
                    className="flex items-center bg-black space-x-4 opacity-90 hover:opacity-70 cursor-pointer rounded-full px-3 py-2"
                    onClick={signOut}
                >
                    <img className="rounded-full w-10 h-10" src="https://i.pravatar.cc/300" alt="" />
                    <h2 className="text-white">{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5 text-white"/>
                    {/* <img  src="" alt=""/> */}
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images[0]?.url} alt=""/>
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
