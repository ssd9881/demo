import { useState } from "react";
import User from "../../../Classes/User";
import { addSmartPlaylist, getSmartPlaylists } from "../../../utils/backend_api_handler";
import SmartPlaylist from "../../../Classes/SmartPlaylist";
import { PlaylistDisplay } from "../../../Classes/Playlist";
import ParentPlaylistDropdown from "./ParentPlaylistDropdown";
import ChildPlaylistChecklist from "./ChildPlaylistChecklist";
import { CustomOptionType } from "../../../Classes/CustomOption";
import CustomSelect from "../../CustomSelect";

type CreateSmartPlaylistProps = {
    playlists: PlaylistDisplay[];
    setSmartPlaylists: (smartPlaylists: SmartPlaylist[]) => void;
}

const CreateSmartPlaylist: React.FC<CreateSmartPlaylistProps> = ({playlists, setSmartPlaylists}) => {
    const [parentPlaylistId, setParentPlaylistId] = useState("");
    const [selectedChildPlaylists, setSelectedChildPlaylists] = useState<{ [id: string]: boolean }>(playlists.reduce((acc, playlist) => {
        acc[playlist.id] = false; // Initialize all checkboxes as unchecked
        return acc;
    }, {} as { [id: string]: boolean }));
    const [isCreating, setCreating] = useState(false);

    const parentPlaylistOptions: CustomOptionType[] = playlists.filter(playlist => playlist.owner_id === JSON.parse(localStorage.getItem('user')!).id).map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.img_url,
        authors: playlist.owner_name
    }));

    const handleChildChange = (playlistId: string, isSelected: boolean) => {
        setSelectedChildPlaylists((prevState) => ({
            ...prevState,
            [playlistId]: isSelected,
        }));
    };

    const handleSubmit = () => {
        setCreating(true);
        const childPlaylistIds = Object.keys(selectedChildPlaylists).filter(id => selectedChildPlaylists[id]);
        const user: User = JSON.parse(localStorage.getItem('user') || '{}');
        const smartPlaylistData = {
            parent_playlist_id: parentPlaylistId,
            children: childPlaylistIds,
            owner_id: user.id
        };
        console.log(smartPlaylistData);
        addSmartPlaylist(smartPlaylistData).then(() => 
            getSmartPlaylists()
                .then(smartPlaylists => {
                    setSmartPlaylists(smartPlaylists);
                    setParentPlaylistId('');
                    setSelectedChildPlaylists({});
                }))
        .catch(error => console.error(error))
        .finally(() => {
            setCreating(false);
            alert("New Smart Playlist added");
        });
    };

    return (
        <div id="create-sp" className="scroll-page">
            <div className="parent-container">
                <span><strong>Parent Playlist: </strong><CustomSelect options={parentPlaylistOptions} onSelectChange={setParentPlaylistId} /></span>
            </div>
            <br/>
            <div className="container-fluid child-container">
                <strong>Child Playlists:</strong>
                <ChildPlaylistChecklist 
                    playlists={playlists} 
                    selectedPlaylists={selectedChildPlaylists} 
                    onSelectionChange={handleChildChange} 
                />
            </div>
            {isCreating ? <p>Creating Smart Playlist...</p> : <button onClick={handleSubmit}>Create Smart Playlist</button>}
        </div>
    )
};

export default CreateSmartPlaylist;