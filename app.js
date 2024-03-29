const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended:false }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const email = req.body.email
    const description = req.body.description

    if (title.trim() === '' && description.trim() === '' && email.trim() === '') {
        res.render('create', { error: true })
    }   else {
        fs.readFile('./data/applications.json', (err, data) => {
          if (err) throw err

          const applications = JSON.parse(data)


          applications.push({
              id: id (),
              title: title,
              email: email,
              description: description,
          })

          fs.writeFile('./data/applications.json', JSON.stringify(applications), err => {
              if (err) throw err 

              res.render('create', { success: true })
          })
        })
    }     

})

app.get('/api/v1/applications', (req, res) => {
    fs.readFile('./data/applications.json', (err, data) => {
        if (err) throw err

        const applications = JSON.parse(data)

        res.json(applications)
    })
})

app.get('/applications', (req, res) => {
    fs.readFile('./data/applications.json', (err, data) => {
        if (err) throw err

        const applications = JSON.parse(data)

        res.render('applications', { applications: applications })
    })
})

app.get('/applications/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/applications.json', (err, data) => {
        if (err) throw err

        const applications = JSON.parse(data)

        const application = applications.filter(application => application.id == id) [0]

        res.render('detail', { application: application })
    })
})

app.get('/applications/:id/delete', (req, res) => {
    const id = req.params.id
  
    fs.readFile('./data/applications.json', (err,data) => {
      if (err) throw err
  
      const applications = JSON.parse(data)
  
      const filteredApplications = applications.filter(application => application.id !== id)
  
      console.log(filteredApplications)
      fs.writeFile('./data/applications.json', JSON.stringify(filteredApplications), err => {
          if (err) throw err
          res.render('applications', {  applications: filteredApplications, deleted: true })
      })
    })
  })

app.listen(5000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 5000...')

})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  } 