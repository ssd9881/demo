import { useState } from 'react';
import SmartPlaylist from '../../../Classes/SmartPlaylist';
import { syncSmartPlaylist } from '../../../utils/smart_playlist';
import SmallPlaylistCard from './SmallPlaylistCard';
import { deleteSmartPlaylist } from '../../../utils/backend_api_handler';

type SmartPlaylistItemProps = {
    smartPlaylist: SmartPlaylist;
    setIsSyncing: (isSyncing: boolean) => void;
    handleDelete: (smartPlaylistId: string) => void;
};

const SmartPlaylistItem: React.FC<SmartPlaylistItemProps> = ({ smartPlaylist, setIsSyncing, handleDelete }) => {
    const [removeUnmatched, setRemoveUnmatched] = useState(false);

    function onSync() {
        setIsSyncing(true);
        try {
            syncSmartPlaylist(smartPlaylist, !removeUnmatched).then(() => {
                alert("Smart Playlist synced");
                setIsSyncing(false);
            });
        } catch (error) {
            setIsSyncing(false);
            console.error("Error syncing smart playlist");
        }
    }

    function onDelete() {
        const parentId = smartPlaylist.parent_playlist.id
        deleteSmartPlaylist(parentId).then(() => {
            handleDelete(parentId);
            alert("Smart Playlist deleted");
        });
    }

    return (
        <div className='row card smart-playlist-card'>
            <div className='col-md-4 col-lg-3'>
                <div className='row'>
                    <div className=''>
                        <p>Parent:</p>
                    </div>
                    <div className=''>
                        <SmallPlaylistCard key={smartPlaylist.parent_playlist.id + "parent"} playlist={smartPlaylist.parent_playlist} />
                    </div>
                </div>
            </div>
            <div className='col-md-5 col-lg-6'>
                <p>Children:</p>
                <div className='row row-cols-1 row-cols-lg-2 row-cols-xxl-3'>
                    {smartPlaylist.children.map(childPlaylist => <div className='col' key={childPlaylist.playlist.id + 'div' + smartPlaylist.parent_playlist.id}><SmallPlaylistCard key={childPlaylist.playlist.id + "child" + smartPlaylist.parent_playlist.id} playlist={childPlaylist.playlist} /></div>)}
                </div>
            </div>
            <div className='col-md-3 sync'>
                <button onClick={onSync}>Sync Playlist</button>
                <br/>
                <input type='checkbox' checked={removeUnmatched} onChange={() => setRemoveUnmatched(!removeUnmatched)} /> Delete Extra Parent Tracks
                <br/>
                <button onClick={onDelete}>Remove Smart Playlist</button>
            </div>
        </div>
    );
};

export default SmartPlaylistItem;
