// ============================================================================
// DIAGNÓSTICO FINAL - Usuario "alejo" no encuentra el login
// ============================================================================
// PEGA ESTO EN LA CONSOLA DEL NAVEGADOR (F12 → Console)
// ============================================================================

function diagnosticFinalAlejo() {
  console.log('='.repeat(80));
  console.log('🔬 DIAGNÓSTICO FINAL - Usuario "alejo"');
  console.log('='.repeat(80));
  
  // 1. Obtener todos los usuarios
  const USERS_KEY = 'soc_monitor_api_users';
  const usersData = localStorage.getItem(USERS_KEY);
  
  console.log('\n📦 CLAVE LOCALSTORAGE:', USERS_KEY);
  console.log('¿Existe:', usersData !== null);
  
  if (!usersData) {
    console.log('\n❌ ❌ ❌');
    console.log('NO HAY DATOS EN LOCALSTORAGE');
    console.log('❌ ❌ ❌');
    console.log('\nSOLUCIÓN: Abre test_login_independiente.html');
    console.log('Click en "Crear Usuarios con Contraseña"');
    console.log('Luego intenta login de nuevo');
    return;
  }
  
  // 2. Parsear usuarios
  let users;
  try {
    users = JSON.parse(usersData);
  } catch (e) {
    console.log('\n❌ ERROR AL PARSEAR:', e.message);
    console.log('Datos crudos:', usersData);
    return;
  }
  
  console.log('\n👥 TOTAL DE USUARIOS:', users.length);
  
  // 3. Mostrar TODOS los usuarios
  console.log('\n📋 TODOS LOS USUARIOS:');
  console.log('-'.repeat(80));
  users.forEach(u => {
    const hasPass = u.password && u.password.trim() !== '';
    console.log(`\nID: ${u.id}`);
    console.log(`  Username: "${u.username}"`);
    console.log(`  Username.trim(): "${u.username.trim()}"`);
    console.log(`  Username.toLowerCase(): "${u.username.toLowerCase()}"`);
    console.log(`  Password: "${u.password}"`);
    console.log(`  Password.trim(): "${u.password ? u.password.trim() : '(vacío)'}"`);
    console.log(`  Password.length: ${u.password ? u.password.length : 0}`);
    console.log(`  Password existe: ${hasPass}`);
    console.log(`  Is Active: ${u.is_active}`);
    console.log(`  Role: ${u.role}`);
  });
  
  // 4. Buscar usuario "alejo" de múltiples formas
  console.log('\n🔍 BUSCANDO USUARIO "alejo" - MÚLTIPLES MÉTODOS:');
  console.log('-'.repeat(80));
  
  // Método 1: Exacto
  const user1 = users.find(u => u.username === 'alejo');
  console.log('\n1️⃣  Exact match (username === "alejo"):');
  console.log('   ', user1 ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  if (user1) console.log('   Usuario:', JSON.stringify(user1, null, 2));
  
  // Método 2: Case-insensitive
  const user2 = users.find(u => u.username.toLowerCase() === 'alejo');
  console.log('\n2️⃣  Case-insensitive (toLowerCase() === "alejo"):');
  console.log('   ', user2 ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  if (user2) console.log('   Usuario:', JSON.stringify(user2, null, 2));
  
  // Método 3: Con trim
  const user3 = users.find(u => u.username.trim() === 'alejo');
  console.log('\n3️⃣  Con trim (username.trim() === "alejo"):');
  console.log('   ', user3 ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  if (user3) console.log('   Usuario:', JSON.stringify(user3, null, 2));
  
  // Método 4: Exacto (mayúsculas)
  const user4 = users.find(u => u.username === 'Alejo');
  console.log('\n4️⃣  Con mayúscula (username === "Alejo"):');
  console.log('   ', user4 ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  if (user4) console.log('   Usuario:', JSON.stringify(user4, null, 2));
  
  // 5. Simular el login
  console.log('\n🎯 SIMULANDO LOGIN:');
  console.log('-'.repeat(80));
  
  const testUsername = 'alejo';
  const testPassword = 'alejo123';
  
  console.log('\nIntentando login con:');
  console.log('  Username:', testUsername);
  console.log('  Password:', testPassword);
  
  // Buscar usuario como lo hace login.html
  const loginUser = users.find(u => u.username.toLowerCase() === testUsername.toLowerCase());
  
  if (!loginUser) {
    console.log('\n❌ ❌ ❌');
    console.log('USUARIO NO ENCONTRADO');
    console.log('❌ ❌ ❌');
    console.log('\n¿Qué usernames existen?');
    users.forEach(u => console.log('  - "' + u.username + '"'));
  } else {
    console.log('\n✅ ✅ ✅');
    console.log('USUARIO ENCONTRADO');
    console.log('✅ ✅ ✅');
    console.log('\nUsuario:', JSON.stringify(loginUser, null, 2));
    
    // Verificar contraseña
    console.log('\nVerificando contraseña:');
    console.log('  Password en sistema:', loginUser.password ? '"' + loginUser.password + '"' : '(vacío)');
    console.log('  Password ingresada:', '"' + testPassword + '"');
    
    if (!loginUser.password || loginUser.password.trim() === '') {
      console.log('\n❌ ❌ ❌');
      console.log('NO TIENE CONTRASEÑA');
      console.log('❌ ❌ ❌');
      console.log('\nSOLUCIÓN: Edita el usuario y ponle contraseña');
    } else if (loginUser.password === testPassword) {
      console.log('\n✅ ✅ ✅');
      console.log('¡CONTRASEÑA CORRECTA!');
      console.log('✅ ✅ ✅');
      console.log('\n🎉 LOGIN DEBERÍA FUNCIONAR');
    } else {
      console.log('\n❌ ❌ ❌');
      console.log('CONTRASEÑA INCORRECTA');
      console.log('❌ ❌ ❌');
      console.log('\nSOLUCIÓN:');
      console.log('  1. Verifica que escribiste la contraseña correcta');
      console.log('  2. Revisa si hay espacios extra');
      console.log('  3. La contraseña en sistema es: "' + loginUser.password + '"');
    }
  }
  
  // 6. Comparaciones específicas
  console.log('\n🧪 COMPARACIONES ESPECÍFICAS:');
  console.log('-'.repeat(80));
  
  if (loginUser) {
    console.log('\nloginUser.password === testPassword:');
    console.log('  "' + loginUser.password + '" === "' + testPassword + '"');
    console.log('  Resultado:', loginUser.password === testPassword);
    
    console.log('\nloginUser.password.trim() === testPassword.trim():');
    console.log('  "' + loginUser.password.trim() + '" === "' + testPassword.trim() + '"');
    console.log('  Resultado:', loginUser.password.trim() === testPassword.trim());
    
    console.log('\nloginUser.password.toLowerCase() === testPassword.toLowerCase():');
    console.log('  "' + loginUser.password.toLowerCase() + '" === "' + testPassword.toLowerCase() + '"');
    console.log('  Resultado:', loginUser.password.toLowerCase() === testPassword.toLowerCase());
  }
  
  // 7. Resumen
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN FINAL:');
  console.log('='.repeat(80));
  
  if (!loginUser) {
    console.log('\n❌ El usuario "alejo" NO existe');
    console.log('\n📝 ACCIÓN:');
    console.log('1. Abre users.html');
    console.log('2. Crea el usuario "alejo"');
    console.log('3. Ponle una contraseña');
    console.log('4. Guarda');
    console.log('5. Intenta login de nuevo');
  } else if (!loginUser.password || loginUser.password.trim() === '') {
    console.log('\n⚠️  El usuario "alejo" existe PERO sin contraseña');
    console.log('\n📝 ACCIÓN:');
    console.log('1. Inicia sesión como "admin"');
    console.log('2. Edita usuario "alejo"');
    console.log('3. Pon contraseña: alejo123');
    console.log('4. Guarda');
    console.log('5. Intenta login de nuevo');
  } else if (loginUser.password !== testPassword) {
    console.log('\n⚠️  El usuario "alejo" existe con contraseña diferente');
    console.log('\n📝 ACCIÓN:');
    console.log('1. La contraseña en sistema es: "' + loginUser.password + '"');
    console.log('2. Usa esa contraseña para login');
    console.log('3. O edita el usuario y pon: alejo123');
  } else {
    console.log('\n✅ TODO CORRECTO - Login debería funcionar');
    console.log('\n📝 SI NO FUNCIONA:');
    console.log('1. Limpia el localStorage del navegador');
    console.log('2. Recarga la página (Cmd+Shift+R o Ctrl+Shift+R)');
    console.log('3. Intenta login de nuevo');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Ejecutar automáticamente
diagnosticFinalAlejo();

// Exponer globalmente
window.diagnosticFinalAlejo = diagnosticFinalAlejo;
