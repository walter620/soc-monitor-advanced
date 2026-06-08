// ============================================================================
// DIAGNÓSTICO PROFUNDO - SOC Monitor Login
// ============================================================================
// COPIA Y PEGA ESTO EN LA CONSOLA DEL NAVEGADOR (F12 → Console)
// ============================================================================

function diagnosticLoginProfundo() {
  console.log('='.repeat(80));
  console.log('🔬 DIAGNÓSTICO PROFUNDO - LOGIN SOC Monitor');
  console.log('='.repeat(80));
  
  // 1. Verificar localStorage
  console.log('\n1️⃣  VERIFICANDO LOCALSTORAGE...');
  console.log('-'.repeat(80));
  
  const allKeys = Object.keys(localStorage);
  console.log(`   Total claves en localStorage: ${allKeys.length}`);
  
  if (allKeys.length === 0) {
    console.log('   ⚠️  localStorage está VACÍO - ¿Has usado la aplicación?');
  } else {
    allKeys.forEach(key => {
      const item = localStorage.getItem(key);
      const isUsers = key.includes('user') || key.includes('monitor');
      const displayValue = isUsers ? JSON.stringify(JSON.parse(item), null, 2).substring(0, 100) : item.substring(0, 50);
      console.log(`   ${isUsers ? '👤' : '📦'} ${key}: ${displayValue}...`);
    });
  }
  
  // 2. Verificar clave de usuarios
  console.log('\n2️⃣  VERIFICANDO CLAVE DE USUARIOS...');
  console.log('-'.repeat(80));
  
  const USERS_KEY = 'soc_monitor_api_users';
  const usersData = localStorage.getItem(USERS_KEY);
  
  if (!usersData) {
    console.log(`   ❌ La clave "${USERS_KEY}" NO existe en localStorage`);
    console.log(`   ❌ ¿El mockAPI.js se cargó correctamente?`);
    console.log(`   ❌ Intenta recargar la página con Ctrl+Shift+R (hard refresh)`);
  } else {
    try {
      const users = JSON.parse(usersData);
      console.log(`   ✅ Clave "${USERS_KEY}" existe`);
      console.log(`   ✅ Tipo: ${typeof users}`);
      console.log(`   ✅ Cantidad: ${users.length} usuario(s)`);
      
      // Verificar estructura
      if (users.length > 0) {
        const firstUser = users[0];
        console.log(`   ✅ Primer usuario:`);
        console.log(`      ID: ${firstUser.id}`);
        console.log(`      Username: ${firstUser.username}`);
        console.log(`      Full Name: ${firstUser.full_name}`);
        console.log(`      Email: ${firstUser.email}`);
        console.log(`      Role: ${firstUser.role}`);
        console.log(`      Password: ${firstUser.password ? '✓ Configurada' : '✗ Vacía'}`);
        console.log(`      Is Active: ${firstUser.is_active}`);
      }
    } catch (e) {
      console.log(`   ❌ Error al parsear: ${e.message}`);
      console.log(`   Datos crudos: ${usersData}`);
    }
  }
  
  // 3. Buscar usuario "alejo"
  console.log('\n3️⃣  BUSCANDO USUARIO "alejo"...');
  console.log('-'.repeat(80));
  
  try {
    const users = usersData ? JSON.parse(usersData) : [];
    const alejo = users.find(u => u.username === 'alejo');
    
    if (!alejo) {
      console.log(`   ❌ Usuario "alejo" NO existe en localStorage`);
      console.log(`   💡 Solución: Crea el usuario primero en users.html`);
      console.log(`   💡 Verifica que escribiste "alejo" (todas las letras minúsculas)`);
    } else {
      console.log(`   ✅ Usuario "alejo" encontrado`);
      console.log(`      ID: ${alejo.id}`);
      console.log(`      Username: ${alejo.username}`);
      console.log(`      Full Name: ${alejo.full_name}`);
      console.log(`      Email: ${alejo.email}`);
      console.log(`      Role: ${alejo.role}`);
      console.log(`      Is Active: ${alejo.is_active}`);
      
      // Verificar contraseña
      if (!alejo.password || alejo.password.trim() === '') {
        console.log(`   ❌ CONTRASEÑA: VACÍA - NO PUEDE LOGIN`);
        console.log(`   💡 Edita el usuario y pon una contraseña`);
      } else {
        console.log(`   ✅ CONTRASEÑA: Configurada ("${alejo.password}")`);
      }
    }
    
    // Verificar todos los usuarios disponibles
    console.log(`\n   📋 TODOS LOS USUARIOS DISPONIBLES:`);
    users.forEach(u => {
      const hasPass = u.password && u.password.trim() !== '';
      const active = u.is_active ? '✓' : '✗';
      const pass = hasPass ? '✓' : '✗';
      console.log(`      ${active} ${u.username.padEnd(15)} - ${u.full_name || 'N/A'} - Pass: ${pass}`);
    });
    
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  // 4. Simular el login
  console.log('\n4️⃣  SIMULANDO LOGIN CON "alejo"...');
  console.log('-'.repeat(80));
  
  try {
    const users = usersData ? JSON.parse(usersData) : [];
    const username = 'alejo';
    const password = 'alejo123'; // Intenta con esta contraseña por defecto
    
    console.log(`   username: "${username}"`);
    console.log(`   password: "${password}"`);
    
    // Buscar usuario
    const user = users.find(u => u.username === username);
    
    if (!user) {
      console.log(`   ❌ Usuario NO encontrado`);
      console.log(`   ❌ ERROR QUE VERÍAS: "Usuario no encontrado. Intenta con: admin o walterio"`);
    } else {
      console.log(`   ✅ Usuario encontrado`);
      
      // Verificar contraseña
      if (user.password && user.password !== password) {
        console.log(`   ❌ Contraseña incorrecta (esperaba: "${password}", tiene: "${user.password}")`);
        console.log(`   ❌ ERROR QUE VERÍAS: "Contraseña incorrecta"`);
      } else if (!user.password || user.password.trim() === '') {
        console.log(`   ❌ Usuario no tiene contraseña`);
        console.log(`   ❌ ERROR QUE VERÍAS: "El usuario no tiene contraseña configurada"`);
      } else {
        console.log(`   ✅ Credenciales correctas`);
        console.log(`   ✅ Login exitoso - redirigiría a dashboard.html`);
      }
    }
    
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  // 5. Verificar código de login
  console.log('\n5️⃣  VERIFICANDO CÓDIGO DE LOGIN...');
  console.log('-'.repeat(80));
  
  const loginScript = document.querySelector('script');
  if (loginScript) {
    const scriptContent = loginScript.innerText;
    
    if (scriptContent.includes('soc_monitor_api_users')) {
      console.log(`   ✅ login.html usa la clave correcta: soc_monitor_api_users`);
    } else {
      console.log(`   ❌ login.html NO usa la clave correcta`);
    }
    
    if (scriptContent.includes('[DEBUG]')) {
      console.log(`   ✅ Debug logging está activo (ver consola para más detalles)`);
    } else {
      console.log(`   ⚠️  Debug logging no detectado`);
    }
  }
  
  // 6. Verificar si mockAPI está cargado
  console.log('\n6️⃣  VERIFICANDO MOCKAPI...');
  console.log('-'.repeat(80));
  
  if (window.mockAPI) {
    console.log(`   ✅ mockAPI está cargado`);
    console.log(`   ✅ Instancia global disponible`);
  } else {
    console.log(`   ❌ mockAPI NO está cargado`);
    console.log(`   ⚠️  Verifica que users.html o login.html incluya el script de mockAPI`);
  }
  
  if (window.userManager) {
    console.log(`   ✅ userManager está cargado`);
  } else {
    console.log(`   ❌ userManager NO está cargado`);
  }
  
  // 7. Resultado final
  console.log('\n' + '='.repeat(80));
  console.log('✅ DIAGNÓSTICO COMPLETADO');
  console.log('='.repeat(80));
  console.log('\n📊 RESUMEN:');
  
  if (!usersData) {
    console.log(`   ❌ localStorage sin datos de usuarios`);
    console.log(`   💡 Solución: Abre users.html y crea usuarios`);
  } else {
    try {
      const users = JSON.parse(usersData);
      const alejo = users.find(u => u.username === 'alejo');
      
      if (!alejo) {
        console.log(`   ❌ Usuario "alejo" no existe`);
        console.log(`   💡 Solución: Crea el usuario en users.html`);
      } else if (!alejo.password || alejo.password.trim() === '') {
        console.log(`   ⚠️  Usuario "alejo" existe PERO sin contraseña`);
        console.log(`   💡 Solución: Edita el usuario y ponle contraseña`);
      } else {
        console.log(`   ✅ Todo debería funcionar correctamente`);
        console.log(`   💡 Usuario "alejo" tiene contraseña configurada`);
        console.log(`   💡 Intenta login con alejo / ${alejo.password}`);
      }
    } catch (e) {
      console.log(`   ❌ Error al analizar datos`);
    }
  }
  
  console.log('\n💡 TIP: Ejecuta "diagnosticLoginProfundo()" en cualquier momento para revisar');
}

// Ejecutar automáticamente
diagnosticLoginProfundo();

// Exponer globalmente
window.diagnosticLoginProfundo = diagnosticLoginProfundo;
