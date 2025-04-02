import { useState } from "react";
import { CustomOptionType } from "../../Classes/CustomOption";
import { PlaylistDisplay } from "../../Classes/Playlist";
import CustomSelect from "../CustomSelect";
import { recommendTracksForPlaylist } from "../../utils/recommender";
import { TrackDisplay } from "../../Classes/Track";
import TrackList from "./TrackList";
import { addTracksToPlaylist } from "../../utils/spotify_api_handler";
import PlaylistLink from "./PlaylistLink";
import { makeTrackUri } from "../../utils/helpers";

const PlaylistEnhancer: React.FC<{playlists: PlaylistDisplay[]}> = ({playlists}) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistDisplay | null>(null);
    const [recommendedTracks, setRecommendedTracks] = useState<TrackDisplay[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [addedTracks, setAddedTracks] = useState(false);

    const playlistOptions: CustomOptionType[] = playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.img_url,
        authors: playlist.owner_name
    }));

    const updateSelectedPlaylist = (id: string) => {
        setRecommendedTracks([]);
        setAddedTracks(false);
        const selectedPlaylist = playlists.find((playlist) => playlist.id === id)!;
        setSelectedPlaylist(selectedPlaylist);
    }

    const handleSuggestions = () => {
        setLoadingRecs(true);
        recommendTracksForPlaylist(selectedPlaylist!).then((tracks) => {
            setRecommendedTracks(tracks);
        })
        .catch((error) => {
            alert("Error ehnacing current playlist.")
        })
        .finally(() => setLoadingRecs(false));
    }

    const handleAddTracks = () => {
        if (selectedPlaylist && recommendedTracks) {
            addTracksToPlaylist(selectedPlaylist.id, recommendedTracks.map((track) => makeTrackUri(track.id))).then(() => {
                alert("Tracks added to playlist!");
                setAddedTracks(true);
            });
        } else {
            alert("Please generate recommendations for a track first.");
        }
    }
    
    return (
        <div id="enhancer" className="scroll-page">
            
            <div className="row">
                <div className="col-lg-5">
                    <h2 className="title">Playlist Enhancer</h2>
                </div>
                <div className="col-lg-7">
                    <p>Select a Playlist to Enhance:</p>
                    <CustomSelect options={playlistOptions} onSelectChange={updateSelectedPlaylist} />
                </div>
            </div>
            <button className="m-2" onClick={handleSuggestions}>Get Suggestions</button>
            {loadingRecs && <p>Loading recommendations... Large playlists will take longer.</p>}
            {(recommendedTracks.length > 0 && selectedPlaylist) && <><p>Recommended Enhancements for <PlaylistLink playlist={selectedPlaylist}/>:</p><TrackList tracks={recommendedTracks}/>
            {!addedTracks && <button onClick={handleAddTracks}>Add Tracks to Playlist</button>}</>}
        </div>
    )
};

export default PlaylistEnhancer;