const Usuario = require('../models/User')
const bcryptjs = require('bcryptjs')

// Resolvers 
const resolvers = {
    Query:{
        obtenerCursos :() =>"Algo"   
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

        }

    }
}

module.exports = resolvers;