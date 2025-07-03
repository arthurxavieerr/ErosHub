import { useEffect, useState, useRef } from 'react'; // Adicionado useRef
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css'
import dashboardIcon from "../assets/icons/Dashboard_icon.png";
import repasseIcon from "../assets/icons/Repasse_icon.png";
import cloneIcon from "../assets/icons/Clone_icon.png";
import staticsIcon from "../assets/icons/statics_icon.png";
import configIcon from "../assets/icons/Config_icon.png";
import logoutIcon from "../assets/icons/Logout_icon.png";
import avatarIcon from "../assets/Avatar.jpg";
import notificationIcon from "../assets/icons/Notification_icon.png";

interface User {
  email: string;
  username: string;
  password: string;
  avatar?: string; // Adicionado campo para avatar
  userInfo: {
    loginName: string;
    locale: string;
    timezone: string;
    lastLogin: string;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Novos estados para o sistema de avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setAvatarPreview(user.avatar || avatarIcon);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Novas funções para gerenciar o avatar
  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter menos de 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (currentUser && avatarPreview) {
      const updatedUser = {
        ...currentUser,
        avatar: avatarPreview
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: User) => 
        user.username === currentUser.username ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      setCurrentUser(updatedUser);
      setShowAvatarModal(false);
    }
  };

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='Container-Dashboard'>
      {/* Mantido todo o código original */}
      <div className='Sidebar-left'>
        <div className='Sidebar-Logo-Container'>
          <div className='Logo-Dashboard'></div>
        </div>
        <div className='Sidebar-navigation'>
          <div className='Dashboard-navigation' onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', backgroundColor: '#333' }}>
            <div className='Icon-navigation'>
              <img src={dashboardIcon} alt='Dashboard Icon' />
            </div>
            <div className='Text-navigation'>Dashboard</div>
          </div>
          <div className='Repasse-navigation' onClick={() => navigate('/repasse')} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={repasseIcon} alt='Repasse Icon' />
            </div>
            <div className='Text-navigation'>Repasse</div>
          </div>
          <div className='Clone-navigation'>
            <div className='Icon-navigation'>
              <img src={cloneIcon} alt='Clone Icon' />
            </div>
            <div className='Text-navigation'>Clone</div>
          </div>
          <div className='Statics-navigation'>
            <div className='Icon-navigation'>
              <img src={staticsIcon} alt='Statics Icon' />
            </div>
            <div className='Text-navigation'>Estatísticas</div>
          </div>
          <div className='Settings-navigation'>
            <div className='Icon-navigation'>
              <img src={configIcon} alt='Settings Icon' />
            </div>
            <div className='Text-navigation'>Configurações</div>
          </div>
        </div>
        <div className='Sidebar-logout'>
          <div className='Logout-navigation' onClick={handleLogout}>
            <div className='Icon-navigation'>
              <img src={logoutIcon} alt='Logout Icon' />
            </div>
          <div className='Text-navigation'>Sair</div>
          </div>
        </div>
      </div>
      <div className='Container-right'>
        <div className='header'>
          <div className='notifications'>
            <div className='notification-icon'>
              <img src={notificationIcon} alt='Notification Icon' />
            </div>
          </div>
          <div className='user-info'>
            <div className='user-avatar' onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              <img 
                src={currentUser.avatar || avatarIcon} 
                alt='Avatar Icon'
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className='user-name'>{currentUser.username}</div>
          </div>
        </div>
        <div className='Container-content'>
          <div className='Content'>
            <h1>Dashboard</h1>
            <p>Gerencie seus scripts de repasse e clonagem de mensagens</p>
            <div className='Info-cards-container'>
              <div className='Info-card'>
                <h2>Scripts Ativos</h2>
                <p>2</p>
              </div>
              <div className='Info-card'>
                <h2>Repasses feitos hoje</h2>
                <p>24</p>
              </div>
              <div className='Info-card'>
                <h2>Grupos em processo de Clonagem</h2>
                <p>1</p>
              </div>
              <div className='Info-card'>
                <h2>Progresso atual da clonagem</h2>
                <p>25%</p>
              </div>
            </div>
            <div className='Recent-activity'>
              <h2>Scripts Ativos</h2>
                <div className="tabela-container">
                  <table className="tabela-bots">
                    <thead>
                      <tr>
                        <th>Nome do Script</th>
                        <th>Tipo</th>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ErosBot</td>
                        <td><a href="#" className="tipo-link">Repasse</a></td>
                        <td>-100832838923</td>
                        <td>-10023832893</td>
                        <td className="status-ativo">Ativo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>
      {showAvatarModal && (
        <div className='avatar-modal'>
          <div className='avatar-modal-content'>
            <h2>Alterar Avatar</h2>
            
            <div className='avatar-preview'>
              <img 
                src={avatarPreview || avatarIcon} 
                alt='Avatar Preview'
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>

            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept='image/*'
              style={{ display: 'none' }}
            />

            <div className='avatar-buttons'>
              <button 
                className='select-image-button'
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar Imagem
              </button>
              
              <button 
                className='save-avatar-button'
                onClick={handleSaveAvatar}
              >
                Salvar
              </button>
              
              <button 
                className='cancel-button'
                onClick={() => setShowAvatarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;