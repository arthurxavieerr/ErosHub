import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';
import './Repasse.css'; // Importa o CSS específico para a página Repasse
import dashboardIcon from "../assets/icons/Dashboard_icon.png";
import repasseIcon from "../assets/icons/Repasse_icon.png";
import cloneIcon from "../assets/icons/Clone_icon.png";
import staticsIcon from "../assets/icons/statics_icon.png";
import configIcon from "../assets/icons/Config_icon.png";
import logoutIcon from "../assets/icons/Logout_icon.png";
import avatarIcon from "../assets/Avatar.jpg";
import notificationIcon from "../assets/icons/Notification_icon.png";
import playIcon from "../assets/icons/Play_icon.png";
import stopIcon from "../assets/icons/Stop_icon.png";

interface User {
  email: string;
  username: string;
  password: string;
  avatar?: string;
  userInfo: {
    loginName: string;
    locale: string;
    timezone: string;
    lastLogin: string;
  }
}

function Repasse() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
    const [command, setCommand] = useState('');


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

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Sidebar */}
      <div className='Sidebar-left'>
        <div className='Sidebar-Logo-Container'>
          <div className='Logo-Dashboard'></div>
        </div>
        <div className='Sidebar-navigation'>
          <div className='Dashboard-navigation' onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={dashboardIcon} alt='Dashboard Icon' />
            </div>
            <div className='Text-navigation'>Dashboard</div>
          </div>
          <div className='Repasse-navigation' onClick={() => navigate('/repasse')} style={{ cursor: 'pointer', backgroundColor: '#333' }}>
            <div className='Icon-navigation'>
              <img src={repasseIcon} alt='Repasse Icon' />
            </div>
            <div className='Text-navigation'>Repasse</div>
          </div>
          <div className='Clone-navigation' onClick={() => navigate('/clone')} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={cloneIcon} alt='Clone Icon' />
            </div>
            <div className='Text-navigation'>Clone</div>
          </div>
          <div className='Statics-navigation' onClick={() => navigate('/estatisticas')} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={staticsIcon} alt='Statics Icon' />
            </div>
            <div className='Text-navigation'>Estatísticas</div>
          </div>
          <div className='Settings-navigation' onClick={() => navigate('/configuracoes')} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={configIcon} alt='Settings Icon' />
            </div>
            <div className='Text-navigation'>Configurações</div>
          </div>
        </div>
        <div className='Sidebar-logout'>
          <div className='Logout-navigation' onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <div className='Icon-navigation'>
              <img src={logoutIcon} alt='Logout Icon' />
            </div>
            <div className='Text-navigation'>Sair</div>
          </div>
        </div>
      </div>

      {/* Main content right side */}
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
            <div className='Content Repasse-content'>
            {/* Top KPIs */}
            <div className='top-kpis'>
                <div className='kpi-card'>
                <h3>Status do Bot</h3>
                <p className='OnlineStatus'>🟢 Online</p>
                </div>
                <div className='kpi-card'>
                <h3>Msgs Processadas</h3>
                <p>1.322</p>
                </div>
                <div className='kpi-card'>
                <h3>Álbuns em Cache</h3>
                <p>11 pendentes</p>
                </div>
            </div>
            <div className='Config_container'>
              <div className='Config_title'>
                <h2>Configurações do Bot de Repasse</h2>
                </div>
              <div className='Config_content'>
                <div className='Config_item'>
                  <div className='Config_item_label'>
                    <label htmlFor='ApiID'>Api ID:</label>
                    <input type='text' placeholder='Digite o ID da sua Api'  id='ApiID'/>
                  </div>
                  <div className='Config_item_label'>
                    <label htmlFor='OrigemID'>Chat de Origem:</label>
                    <input type='text' placeholder='Digite o ID do Chat de Origem' id='OrigemID'/>
                  </div>
                  <div className='Config_item_label'>
                    <label htmlFor='ApiHash'>Api Hash:</label>
                    <input type='text' placeholder='Digite sua Api Hash'  id='ApiHash'/>
                  </div>
                  <div className='Config_item_label'>
                    <label htmlFor='DestinoID'>Chat de Destino:</label>
                    <input type='text' placeholder='Digite o ID do seu Chat de Destino'  id='DestinoID'/>
                  </div>
                  <div className='Config_item_label'>
                    <label htmlFor='BotToken'>Bot Token:</label>
                    <input type='text' placeholder='Digite o Token do Seu Bot'  id='BotToken'/>
                  </div>
                  </div>
                  <div className='Config_button'>
                    <button onClick={() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Configurações salvas com sucesso!`])}>
                      Salvar Configurações
                    </button>
                  </div>
                </div>
            </div>
            {/* Script Controls */}
            <div className='script-controls'>
                <button onClick={() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ▶ Script iniciado`])}>
                <div className='Icon-navigation'>
                    <img src={playIcon} alt='Play Icon' />
                </div>
                Iniciar Script
                </button>
                <button onClick={() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ■ Script parado`])}>
                <div className='Icon-navigation'>
                    <img src={stopIcon} alt='Stop Icon' />
                </div>
                Parar Script
                </button>
            </div>

            {/* SSH Command Input */}
            <div className='ssh-command-input' style={{ marginBottom: '20px' }}>
                <input 
                type='text' 
                placeholder='Digite comando SSH...' 
                value={command} 
                onChange={e => setCommand(e.target.value)} 
                onKeyDown={e => {
                    if (e.key === 'Enter' && command.trim()) {
                    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] $ ${command}`]);
                    setCommand('');
                    // Aqui você pode adicionar chamada para executar comando via SSH
                    }
                }}
                style={{ width: '80%', padding: '8px' }}
                />
                <button className='send-command-button'
                onClick={() => {
                    if (command.trim()) {
                    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] $ ${command}`]);
                    setCommand('');
                    // Aqui você pode adicionar chamada para executar comando via SSH
                    }
                }}
                style={{ marginLeft: '10px', padding: '8px 16px' }}
                >
                Enviar
                </button>
            </div>

            {/* Logs Panel */}
            <div className='painel-logs'>
                <h3>Painel de Logs</h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {logs.length === 0 && <li><i>Sem logs disponíveis</i></li>}
                {logs.map((log, idx) => (
                    <li key={idx}>{log}</li>
                ))}
                </ul>
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

export default Repasse;
