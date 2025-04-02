import { PlaylistDisplay } from "../../../Classes/Playlist";
import PlaylistLink from "../PlaylistLink";

const SmallPlaylistCard: React.FC<{playlist: PlaylistDisplay}> = ({playlist}) => {
    return (
        <div className="row playlist-card">
            <div className="col-lg-5">
                <img src={playlist.img_url.length === 0? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png" : playlist.img_url} className="playlist-card-image" />
            </div>
            <div className="col-lg-7">
                <strong className="name"><PlaylistLink playlist={playlist}/></strong>
                <p><small className="owner"> by {playlist.owner_name}</small></p>
            </div>
        </div>
    );
};

export default SmallPlaylistCard;