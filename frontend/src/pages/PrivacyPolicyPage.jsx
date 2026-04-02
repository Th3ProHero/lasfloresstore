import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div className="text-center mb-10">
            <span className="text-5xl">🔒</span>
            <h1 className="font-display text-4xl font-bold text-slate-dark mt-4 mb-2">Aviso de Privacidad</h1>
            <p className="text-slate-mid text-sm">Última actualización: Abril 2025</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-cream-200 p-8 md:p-10 space-y-8 text-slate-mid leading-relaxed">

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">1. Responsable del Tratamiento de Datos</h2>
              <p>
                <strong>Abarrotes Las Flores</strong>, con domicilio en <strong>Niños Héroes 29, Palmitas,
                Iztapalapa, 09670, Ciudad de México, CDMX</strong>, es responsable del tratamiento de tus datos
                personales, de conformidad con la <em>Ley Federal de Protección de Datos Personales en Posesión
                de los Particulares</em> (LFPDPPP).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">2. Datos que Recabamos</h2>
              <p>Para operar tu cuenta y procesar pedidos, recabamos únicamente:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-sm">
                <li><strong>Nombre completo</strong> — para identificarte en tus pedidos</li>
                <li><strong>Correo electrónico</strong> — para enviarte confirmaciones y notificaciones de pedido</li>
                <li><strong>Número de celular</strong> — opcional, para contacto sobre tu pedido</li>
              </ul>
              <p className="mt-3 text-sm bg-green-50 border border-green-200 rounded-xl p-3">
                ✅ <strong>No</strong> recabamos datos bancarios, datos de pago ni información sensible. Todos los pagos son en efectivo en sucursal.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">3. Finalidad del Uso de Datos</h2>
              <p>Tus datos se utilizan <strong>exclusivamente</strong> para:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-sm">
                <li>Crear y administrar tu cuenta de usuario</li>
                <li>Registrar y confirmar tus pedidos</li>
                <li>Enviarte notificaciones de estado de pedido por correo electrónico</li>
                <li>Permitirte recuperar tu contraseña</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">4. Transferencia de Datos</h2>
              <p>
                Tus datos personales <strong>NO son vendidos, cedidos ni transferidos</strong> a terceros bajo ninguna
                circunstancia, salvo las excepciones previstas en la LFPDPPP (obligaciones legales, órdenes judiciales).
                El único servicio externo que procesa datos es el proveedor de correo electrónico para el envío de 
                notificaciones, bajo estrictas políticas de confidencialidad.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">5. Derechos ARCO</h2>
              <p>
                Tienes derecho a <strong>Acceder, Rectificar, Cancelar u Oponerte</strong> (derechos ARCO)
                al tratamiento de tus datos. Para ejercerlos, contáctanos por WhatsApp al{' '}
                <a href="https://wa.me/525560678528" className="text-terracotta font-semibold hover:underline">
                  +52 55 6067 8528
                </a>{' '}
                o acude a nuestra sucursal en horario de 9:00 AM a 9:30 PM.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">6. Seguridad</h2>
              <p>
                Implementamos medidas técnicas y administrativas para proteger tus datos contra acceso no
                autorizado, pérdida o alteración. Las contraseñas se almacenan cifradas (bcrypt) y nunca
                en texto plano.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">7. Cambios a este Aviso</h2>
              <p>
                Cualquier modificación a este Aviso de Privacidad será notificada a través de la página web.
                La fecha de última actualización indica la versión vigente.
              </p>
            </section>

            <div className="bg-terracotta/5 border border-terracotta/20 rounded-2xl p-5 text-center">
              <p className="text-sm text-slate-mid">
                🌸 En <strong>Abarrotes Las Flores</strong> tu privacidad es tan importante como tu compra.<br/>
                Gracias por confiar en nosotros.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
