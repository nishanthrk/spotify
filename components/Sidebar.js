import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon } from "@heroicons/react/outline"
import { HeartIcon } from "@heroicons/react/solid"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify"
import { playlistIdState } from "../atoms/playlistAtom";


function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlist, setPlayLists] = useState([]);
    const [playlistId, setPlayListId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists(session?.user.username)
                .then(function (data) {
                    setPlayLists(data.body.items);
                    setPlayListId(data.body.items[0].id);
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
        }
    }, [session, spotifyApi]);

    console.log("You picked the play list >>>", playlistId)

    return (
        <div className="text-gray-500 p-5 text-sm lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[16rem] hidden md:inline-flex">
            <div className="space-y-4">
                {/* <button className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()}>
                    <HomeIcon className="h-5 w-5" />
                    <p>Logout</p>
                </button> */}
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5 border-red-500 text-red-500" />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5 text-emerald-600" />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />
                {playlist.map((list) => (
                    <p key={list.id} onClick={() => setPlayListId(list.id)} className={`cursor-pointer hover:text-white ${playlistId === list.id ? 'text-white' : ''}`}>{list.name}</p>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
