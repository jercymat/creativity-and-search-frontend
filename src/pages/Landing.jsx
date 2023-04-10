import { LogoLarge } from '../components/general/logo';
import SearchField from '../components/search/SearchField';
import config from '../config';

function LandingPage() {
  return (
    <div id='im-landing-wrap' style={{
      width: '100%',
      position: 'absolute',
      top: '18%'
    }}>
      <LogoLarge id='im-main-logo' className='mb-4' />
      <SearchField
        id='im-search-area'
        className='w-50 mx-auto mb-3'
        placeholder='Your creativity starts here.'/>
      <p className="text-center"><small>Version v{config.PRODUCT_VERSION}</small></p>
    </div>
  )
}

export default LandingPage;