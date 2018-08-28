<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Contacto;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{
	/**
	 * @Route("/", name="homepage")
	 * @Template("AppBundle:Sitio:home.html.twig")
	 */
	public function indexAction(Request $request)
	{
		 
		return array();
	}

	/**
	 * @Template("AppBundle:Sitio:component_promociones.html.twig")
	 */
	public function promocionesAction(Request $request) {

		$promociones = $this->getDoctrine()->getRepository('AppBundle:Promocion')->find4Site(3);
		return array('promociones'=>$promociones);
		 
	}

	/**
	 * @Template("AppBundle:Sitio:component_galeria.html.twig")
	 */
	public function galeriaAction(Request $request,$galeria_id=0) {

		if(empty($galeria_id)) $galerias = $this->getDoctrine()->getRepository('AppBundle:Galeria')->findAll();
		else  $galerias = array($this->getDoctrine()->getRepository('AppBundle:Galeria')->find($galeria_id));
		 
		return array('galerias'=>$galerias);
		 
	}

	/**
	 * @Route("/cabanas", name="cabanas")
	 * @Template("AppBundle:Sitio:cabanas.html.twig")
	 */
	public function cabanasAction(Request $request)
	{

		return array();
	}

	/**
	 * @Route("/suites", name="suites")
	 * @Template("AppBundle:Sitio:suites.html.twig")
	 */
	public function suitesAction(Request $request)
	{

		return array();
	}
	
	/**
	 * @Route("/amigos", name="amigos")
	 * @Template("AppBundle:Sitio:amigos.html.twig")
	 */
	public function amigosAction(Request $request)
	{

		return array();
	}

	/**
	 * @Route("/contacto-ajax",name="contacto-ajax")
	 */
	public function contactoAjaxAction(Request $request) {
		$rta = array('ok'=>0,'error'=>0);
		$nombre = $request->request->get('nombre','');
		$email = $request->request->get('email','');
		$telefono = $request->request->get('telefono','');
		$mensaje = $request->request->get('mensaje','');

		$contacto = new Contacto();
		$contacto->setNombre($nombre);
		$contacto->setEmail($email);
		$contacto->setTelefono($telefono);
		$contacto->setMensaje($mensaje);
		$contacto->setFecha(new \DateTime());
		$this->getDoctrine()->getManager()->persist($contacto);
		$this->getDoctrine()->getManager()->flush();

		try {
			$asunto = $this->getParameter('asunto_contacto','Contacto desde el sitio');
			$asunto = str_replace('_nombre_',$nombre,$asunto);
			$from = $this->getParameter('contacto_from');
			$to = $this->getParameter('contacto_to');
			$body = $this->renderView('AppBundle:Sitio:email_contacto.html.twig',
					array(
							'nombre' => $nombre,
							'telefono' => $telefono,
							'email' => $email,
							'mensaje' => $mensaje,
					));

			$email_reply_to = $email;
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
				$email_reply_to = $from;
			}
			 
			$message = \Swift_Message::newInstance()
			->setSubject($asunto)
			->setFrom($from)
			->setTo($to)
			->setBody($body,'text/html')
			->setReplyTo($email_reply_to)
			;
			 
			$this->get('mailer')->send($message);
			$rta['ok'] = true;
			 
		} catch(\Exception $ex) {
			$rta['error'] = true;
			//throw $ex;
			error_log("Imposible enviar email de contacto ".$ex->getMessage());
		}
		return new JsonResponse($rta);
	}
}
