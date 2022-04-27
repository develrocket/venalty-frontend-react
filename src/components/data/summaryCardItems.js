

import CommuteOutlinedIcon from '@material-ui/icons/CommuteOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import ReceiptIcon from '@material-ui/icons/Receipt';
import GroupIcon from '@material-ui/icons/Group';


const SummaryIconsStyle = {

    width: '40px',
    height: '40px',
    color: '#4d4d4d',
};
export const SummaryCardItems = [

    {
        id: 'vehicle',
        color: '#0066ff',
        title: 'Günümüzün yeni araçları',
        value: '0',
        url: '/arac', 
        icon: <CommuteOutlinedIcon style={SummaryIconsStyle} />
    },
    {
        id: 'penalties',
        color: '#ff0000',
        title: 'Bugünün yeni cezaları',
        value: '0',
        url: '/ceza', 
        icon: <GavelIcon style={SummaryIconsStyle}/>
    },
    {
        id: 'total_penalties',
        color: '#009933',
        title: 'Toplam Cezalar',
        value: '0',
        url: '/ceza', 
        icon: <GroupIcon style={SummaryIconsStyle} />
    },
    {
        id: 'total_vehicles',
        color: '#ffcc00',
        title: 'Toplam araç',
        value: '0',
        url: '/arac', 
        icon: <ReceiptIcon style={SummaryIconsStyle} />
    }

];