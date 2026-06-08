// ============================================================================
// DIAGNÓSTICO DE USUARIOS - SOC Monitor
// ============================================================================
// Copia y pega esto en la consola del navegador (F12 → Console)
// ============================================================================

function diagnosticUsuarios() {
  console.log('='.repeat(70));
  console.log('🔍 DIAGNÓSTICO DE USUARIOS - SOC Monitor');
  console.log('='.repeat(70));
  
  // 1. Claves disponibles
  console.log('\n1️⃣  CLAVES DISPONIBLES EN localStorage:');
  console.log('-'.repeat(70));
  const allKeys = Object.keys(localStorage);
  if (allKeys.length === 0) {
    console.log('   ❌ localStorage está vacío');
  } else {
    allKeys.forEach(key => console.log(`   • ${key}`));
  }
  
  // 2. Clave de usuarios
  console.log('\n2️⃣  DATOS DE USUARIOS:');
  console.log('-'.repeat(70));
  const usersKey = 'soc_monitor_api_users';
  const usersData = localStorage.getItem(usersKey);
  
  if (!usersData) {
    console.log(`   ❌ No existe la clave: "${usersKey}"`);
    console.log('   ❌ Los usuarios NO están guardados');
  } else {
    console.log(`   ✅ Clave "${usersKey}" existe`);
    try {
      const users = JSON.parse(usersData);
      console.log(`   ✅ Número de usuarios: ${users.length}`);
      
      if (users.length === 0) {
        console.log('   ⚠️  El array de usuarios está vacío');
      } else {
        console.log('\n   👥 USUARIOS DISPONIBLES:');
        users.forEach(u => {
          const hasPassword = u.password && u.password.trim() !== '';
          console.log(`\n      ID: ${u.id}`);
          console.log(`      Username: ${u.username}`);
          console.log(`      Nombre: ${u.full_name || 'N/A'}`);
          console.log(`      Email: ${u.email}`);
          console.log(`      Rol: ${u.role}`);
          console.log(`      Activo: ${u.is_active}`);
          console.log(`      Contraseña: ${hasPassword ? '✅ Configurada' : '❌ Vacía'}`);
        });
      }
    } catch (e) {
      console.log(`   ❌ Error al parsear: ${e.message}`);
      console.log('   Datos crudos:', usersData);
    }
  }
  
  // 3. Test de login
  console.log('\n3️⃣  TEST DE LOGIN:');
  console.log('-'.repeat(70));
  const testUsers = ['admin', 'walterio', 'alejo'];
  testUsers.forEach(username => {
    const users = usersData ? JSON.parse(usersData) : [];
    const user = users.find(u => u.username === username);
    
    if (user) {
      const hasPassword = user.password && user.password.trim() !== '';
      console.log(`   ✅ "${username}": Existe`);
      console.log(`      ${hasPassword ? '✅ Tiene contraseña' : '❌ Sin contraseña (NO PODRÁ LOGIN)'}`);
    } else {
      console.log(`   ❌ "${username}": NO existe`);
    }
  });
  
  // 4. Sugerencias
  console.log('\n4️⃣  SUGERENCIAS:');
  console.log('-'.repeat(70));
  const users = usersData ? JSON.parse(usersData) : [];
  const alejo = users.find(u => u.username === 'alejo');
  
  if (!alejo) {
    console.log('   ❌ El usuario "alejo" NO existe en localStorage');
    console.log('   ✅ Solución:');
    console.log('      1. Abre users.html');
    console.log('      2. Click en "Nuevo Usuario"');
    console.log('      3. Crea el usuario "alejo"');
    console.log('      4. Ponle una contraseña');
    console.log('      5. Guarda');
    console.log('      6. Vuelve a ejecutar este diagnóstico');
  } else if (!alejo.password || alejo.password.trim() === '') {
    console.log('   ⚠️  El usuario "alejo" existe PERO no tiene contraseña');
    console.log('   ✅ Solución:');
    console.log('      1. Inicia sesión como "admin"');
    console.log('      2. Ve a users.html');
    console.log('      3. Edita "alejo"');
    console.log('      4. Pon una contraseña');
    console.log('      5. Guarda');
    console.log('      6. Ahora puedes login con "alejo"');
  } else {
    console.log('   ✅ El usuario "alejo" existe Y tiene contraseña');
    console.log('   ✅ Debería poder login correctamente');
    console.log('   💡 Revisa:');
    console.log('      - ¿Estás usando la contraseña correcta?');
    console.log('      - ¿Hay espacio extra en username/password?');
    console.log('      - ¿El navegador tiene caché antigua?');
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ DIAGNÓSTICO COMPLETADO');
  console.log('='.repeat(70));
}

// Ejecutar automáticamente
diagnosticUsuarios();

// También expone la función globalmente
window.diagnosticUsuarios = diagnosticUsuarios;

// Mensaje de ayuda
console.log('\n💡 Tip: Ejecuta "diagnosticUsuarios()" en cualquier momento para revisar el estado');
