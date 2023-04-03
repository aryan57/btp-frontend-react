import React, { useState, useRef,useEffect } from "react"
import Header from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"

export default function Category() {

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const categoryRef = useRef()
	const [categoryList, setCategoryList] = useState(null)


	const { createCategory, updateCategoryMappings, getCategories } = useAuth()

	useEffect(()=>{
		getCategories().then((lst)=>{
			setCategoryList(lst)
		})
	},[])

	async function createNewCategory() {

		if (!categoryRef.current.value) {
			setError("Category name can't be empty")
			return
		}

		setLoading(true)
		setSuccess("")
		setError("")

		try {

			const createCategoryResult = await createCategory(categoryRef.current.value)
			if (createCategoryResult && createCategoryResult.error) throw createCategoryResult
			const result = await updateCategoryMappings()
			if (result && result.error) throw result

			const lst = await getCategories()
			setCategoryList(lst)

			setSuccess(createCategoryResult)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
			categoryRef.current.value = ""
		}
	}

	return (
		<>
			<Header />
			<Container className="d-flex align-items-center justify-content-center">
				<div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

					<h2 className="text-center mb-4">Categories</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}

					<Table striped bordered hover responsive style={{ marginTop: 10 }}>
						<tbody>
							<tr>
								<td style={{ width: '450px' }} >
									<InputGroup >
										<FormControl type="text" ref={categoryRef} placeholder="New Category Name" />
									</InputGroup>
								</td>
								<td>
									<Button disabled={loading} onClick={createNewCategory}>
										Add
									</Button>
								</td>
							</tr>
							{
								categoryList &&

								categoryList.map((category) => (
									<tr key={category}>
										<td colSpan={2}>
											{category}
										</td>
									</tr>
								))

							}


						</tbody>
					</Table>

				</div>
			</Container >
		</>
	)
}