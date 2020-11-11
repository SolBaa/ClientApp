const Usuario = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({path :'.env'});

const creatToken=(usuario,secreta, expiresIn)=>{
    const{id, email, nombre, apellido} = usuario

    return jwt.sign({id,email,nombre,apellido}, secreta, {expiresIn})


}

// Resolvers 
const resolvers = {
    Query:{
        obtenerUsuario : async(_, {token}) =>{
       const usuarioId = await jwt.verify(token, process.env.SECRET)
            return usuarioId
    } 
    },
    Mutation :{
        nuevoUsuario: async (_, {input}) => {
            const {email, password} = input

            // REvisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email})
            
            if (existeUsuario){
                throw new Error('El Usuario ya se encuantra registrado')
            }

            // Hashear la password de
            const salt = await bcryptjs.getSalt(10)
            input.password = await bcryptjs.hash(password, salt)
            // Guardarlo enla base de datos

            try {
                const usuario = new Usuario(input)
                 usuario.save(); //Esto lo guarda en la db
                return usuario
            } catch (error) {
                console.log(error);
            }

        },

        autenticarUsuario:async (_, {input}) =>{
            const {email, password} = input

            // REvisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email})
            if (!existeUsuario){
                throw new Error('El Usuario no exite')
            }
            // Revisar si el password es corrrecto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error('El Password es incorrecto ')


            }
            // Crear el token
            return{
                token: creatToken(existeUsuario,process.env.SECRET, '24h' )
            }
        }

    }
}

module.exports = resolvers;