import { useLocation } from 'react-router-dom';


export default function Footer() {
    const { pathname } = useLocation();
    
    return (
      <footer>
        <div className='bg-emerald-900 min-h-25 flex items-center justify-center'>
          <span className="text-center text-white block">
            © 2025 Recipe Site
          </span>
        </div>
      </footer>
    );
}