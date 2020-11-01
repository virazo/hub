const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Entity = require('../models/Entity')

// @desc    Show add page
// @route   GET /entities/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('entities/add')
})

// @desc    Process add form
// @route   POST /entities
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Entity.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all entities
// @route   GET /entities
router.get('/', ensureAuth, async (req, res) => {
  try {
    const entities = await Entity.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('entities/index', {
      entities,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single entity
// @route   GET /entities/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let entity = await Entity.findById(req.params.id).populate('user').lean()

    if (!entity) {
      return res.render('error/404')
    }

    if (entity.user._id != req.user.id && entity.status == 'private') {
      res.render('error/404')
    } else {
      res.render('entities/show', {
        entity,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /entities/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const entity = await Entity.findOne({
      _id: req.params.id,
    }).lean()

    if (!entity) {
      return res.render('error/404')
    }

    if (entity.user != req.user.id) {
      res.redirect('/entities')
    } else {
      res.render('entities/edit', {
        entity,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update entity
// @route   PUT /entities/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let entity = await Entity.findById(req.params.id).lean()

    if (!entity) {
      return res.render('error/404')
    }

    if (entity.user != req.user.id) {
      res.redirect('/entities')
    } else {
      entity = await Entity.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete entity
// @route   DELETE /entities/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let entity = await Entity.findById(req.params.id).lean()

    if (!entity) {
      return res.render('error/404')
    }

    if (entity.user != req.user.id) {
      res.redirect('/entities')
    } else {
      await Entity.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User entities
// @route   GET /entities/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const entities = await Entity.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('entities/index', {
      entities,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
