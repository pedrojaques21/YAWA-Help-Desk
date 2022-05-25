const express = require('express')
const router = express.Router()
const Faq = require('../models/faq')

//All Faqs Route
router.get('/', async (req,res) =>{
    let searchOptions_ = {}
    if (req.query.topic != null && req.query.topic !== '') {
        searchOptions_.topic = new RegExp(req.query.topic, 'i')
    }
    try {
        const faqs = await Faq.find(searchOptions_)
        res.render('faqs/_all', {
            faqs: faqs,
            searchOptions_: req.query
        })

    } catch {
        res.redirect('/')
    }
})

//New Faq Route
router.get('/new_', (req, res) => {
    res.render('faqs/new_', { faq: new Faq()})
})

//Create Faq Route
router.post('/', async (req, res) => {
    const faq = new Faq({
        topic: req.body.topic,
        message: req.body.message
    })
    try {
        const newFaq = await faq.save()
        res.redirect(`faqs/${newFaq.id}`)
    } catch {
        res.render('faqs/new_', {
            faq: faq,
            errorMessage: 'Error creating faq'
        })
    }
})

router.get('/:id', async (req,res) => {
    let faq
    try {
        faq = await Faq.findById(req.params.id)
        res.render('faqs/_view', {
            faq: faq
        })
    } catch {
        if(faq == null) {
            res.redirect('/')
        } else {
            res.render('faqs/_edit', {
                faq: faq,
                errorMessage: 'Error updating faq'
            })
        }
    }
})

router.get('/:id/_edit', async (req,res) => {

    try {
        const faq = await Faq.findById(req.params.id)
        res.render('faqs/_edit', { faq: faq})
    } catch {
        res.redirect('/faqs')
    }
})

router.put('/:id', async (req,res) => {
    let faq
    try {
        faq = await Faq.findById(req.params.id)
        faq.topic = req.body.topic
        faq.message = req.body.message
        await faq.save()
        res.redirect(`/faqs/${faq.id}`)
    } catch {
        if(faq == null) {
            res.redirect('/')
        } else {
            res.render('faqs/_edit', {
                faq: faq,
                errorMessage: 'Error updating faq'
            })
        }
    }
})

router.delete('/:id', async (req,res) => {
    let faq
    try {
        faq = await Faq.findById(req.params.id)
        await faq.remove()
        res.redirect('/faqs')
    } catch {
        if(faq == null) {
            res.redirect('/')
        } else {
            res.redirect(`/faqs/${faq.id}`)
        }
    }
})

module.exports = router